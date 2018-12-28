import process from 'process'
import fetch from 'isomorphic-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'

import { isDevelopment, isClient, isServer } from 'app/lib/func'

const GRAPHQL_HOST = process.env.GRAPHQL_HOST

if (!GRAPHQL_HOST) {
  throw new Error('You must set GRAPHQL_HOST environment variable prior to using Apollo.')
}

// Polyfill fetch() if needed. Useful for server-side code.
const fetcher = global.fetch || fetch

// Override fetch to always include credentials.
// @TODO: could this be done elsewhere?
global.fetch = (uri, options = {}) => {
  options.credentials = 'include'
  return fetcher(uri, options)
}

/**
 * ID normalization. Will use, in order of precedence, a provided 'id', '_id', or
 * 'entityId' field as unique identificator, prefixed with the object's type.
 *
 * Fallbacks to default normalization system.
 *
 * @param {String} id The object's unique id.
 * @param {String} _id The object's unique id.
 * @param {String} entityId The object's unique id.
 * @param {String} __typename The object's type in GraphQL.
 *
 * @return {!String} Either a unique identificator if found, or nil.
 */
const dataIdFromObject = ({ id, _id, entityId, __typename }) => id || _id || entityId
  ? `${__typename}:${id || _id || entityId}`
  : undefined

const defaultCacheOptions = { dataIdFromObject }

const typesQuery = `
  {
    __schema {
      types {
        kind
        name
        possibleTypes {
          name
        }
      }
    }
  }
`

let instrospectionResult = null

/**
 * Loads instrospection data.
 * Performs a first non-client query to get GraphQL type
 * information. This process should run only once on the server.
 */
const getIntrospectionData = () => fetch(GRAPHQL_HOST, {
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: typesQuery }),
  method: 'POST'
})
  .then(result => result.json())
  .then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null,
    )
    result.data.__schema.types = filteredData

    return result.data
  })

/**
 * Instrospect the GraphQL server for type information (unions, interface, etc.).
 * Either get data from a new query execution or from an already fetched instrospetion result
 */
export const introspect = async () => instrospectionResult || (instrospectionResult = await getIntrospectionData())

/**
 * Creates a new ApolloClient instance.
 *
 * @param {Object} initialState Hydrating state.
 * @return {ApolloClient}.
 */
const create = ({
  context,
  initialState = {},
  cacheOptions = {},
}) => new ApolloClient({
  connectToDevTools: isClient() && isDevelopment(),
  ssrMode: isServer(), // Disables forceFetch on the server (so queries are only run once)
  link: createHttpLink({ uri: GRAPHQL_HOST }),
  cache: new InMemoryCache({ ...defaultCacheOptions, ...cacheOptions })
    .restore(initialState)
})

let apolloClient = null

/**
 * Initialize ApolloClient for either server ou client side.
 *
 * @param {Object} options.initialState
 * @param {Object} options.context
 * @param {Object} options.cache
 */
export default options => isClient() // "client-side?"
  // On the CLIENT, always reuse any available ApolloClient instance.
  ? apolloClient || (apolloClient = create(options))

  // On the SERVER, always create a new ApolloClient instance.
  // @TODO: we should reconsider this. Maybe it is best to consider SSR execution
  // as an anonymous request always, and let contextual data be handled on the client,
  // thus improving performance for the majority of users, which are anonymous.
  : create(options)
