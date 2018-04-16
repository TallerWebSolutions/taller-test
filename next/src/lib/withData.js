import React from 'react'
import { pick } from 'ramda'
import PropTypes from 'prop-types'
import { getDisplayName } from 'recompose'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import Head from 'next/head'

import initApollo, { introspect } from './initApollo'

import { IgnoreStyleSheets } from '../containers/IgnoreStyleSheets'

export default ComposedComponent => class WithData extends React.Component {
  static displayName = `WithData(${getDisplayName(ComposedComponent)})`

  static propTypes = {
    __APOLLO_STATE__: PropTypes.object,
    __APOLLO_INSTROSPECTION__: PropTypes.object,
  }

  /**
   * Fetch GraphQL data on server to match request.
   *
   * Next.js is of big help here; it WILL automatically run this function
   * on first page load (not when routing on the client-side) and inject the
   * resolved properties, serialized, to the component once it is loaded on the
   * client-side.
   *
   * Keep in mind that for client-side routing this method WILL get called,
   * meaning you have to account for it running on some situations.
   *
   * @param {Object} ctx
   * @param {String} ctx.pathname Path section of URL
   * @param {Object} ctx.query Query string section of URL parsed as an object
   * @param {String} ctx.asPath String of the actual path (including the query) shows in the browser
   * @param {Object} ctx.req HTTP request object (server only)
   * @param {Object} ctx.res HTTP response object (server only)
   * @param {Object} ctx.jsonPageRes Fetch Response object (client only)
   * @param {Object} ctx.err Error object if any error is encountered during the rendering
   *
   * @return {Object} initial props.
   */
  static async getInitialProps (ctx) {
    // Evaluate the composed component's getInitialProps().
    // This setup is needed to allow for additional getInitialProps on each
    // page using Apollo connector.
    const props = ComposedComponent && ComposedComponent.getInitialProps
      ? await ComposedComponent.getInitialProps(ctx)
      : {}

    const introspectionQueryResultData = await introspect()
    const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData })

    const initialProps = { ...props, __APOLLO_INSTROSPECTION__: introspectionQueryResultData }

    // When already on the client-side, do not defer initialization.
    if (process.browser || process.env.APOLLO_SSR_OFF) return initialProps

    const apolloClient = initApollo({
      context: pick(['res'], ctx),
      cacheOptions: { fragmentMatcher }
    })

    try {
      const router = pick(['query', 'pathname', 'asPath', 'res', 'req'], ctx)

      /**
       * Some contexts are not available during SSR. `router`, for instance.
       * We are basically passing to getDataFromTree an extra context object to
       * hold these, when necessary.
       *
       * @see: https://github.com/zeit/next.js/issues/2908
       */
      const context = { router }

      // Mount ComposedComponent element tree.
      const tree = (
        <ApolloProvider client={ apolloClient }>
          <IgnoreStyleSheets>
            <ComposedComponent url={ router } { ...props } />
          </IgnoreStyleSheets>
        </ApolloProvider>
      )

      // Run all GraphQL queries in the component tree and extract the resulting data
      await getDataFromTree(tree, context)
    }
    catch (error) {
      console.error('SSR Apollo data loading error:', error)
      // Prevent Apollo Client GraphQL errors from crashing SSR.
      // Handle them in components via the data.error prop:
      // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
    }

    // getDataFromTree does not call componentWillUnmount
    // head side effect therefore need to be cleared manually
    Head.rewind()

    // Inject current Apollo state on the page's initial properties.
    initialProps.__APOLLO_STATE__ = apolloClient.cache.extract()

    return initialProps
  }

  constructor (props) {
    super(props)

    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData: this.props.__APOLLO_INSTROSPECTION__
    })

    this.apollo = initApollo({
      initialState: this.props.__APOLLO_STATE__,
      cacheOptions: { fragmentMatcher },
    })
  }

  render () {
    // Extract Apollo state, for ComposedComponent doesn't need to know it existed.
    const { __APOLLO_STATE__, __APOLLO_INSTROSPECTION__, ...props } = this.props

    return (
      <ApolloProvider client={ this.apollo }>
        <ComposedComponent { ...props } />
      </ApolloProvider>
    )
  }
}
