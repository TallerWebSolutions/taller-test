import { pipe, defaultTo, prop, over, lensProp } from 'ramda'
import React from 'react'
import { func } from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import { rename } from 'app/lib/func'

const query = gql`
  query Channels {
    channels: taxonomyTermQuery(limit: 20, filter: { conditions: [{ field: "vid", value: ["channel"] }] }) {
      count
      entities {
        ... on TaxonomyTerm {
          tid
          name
        }
      }
    }
  }
`

const normalize = pipe(
  rename('data', 'channels'),
  over(lensProp('channels'), pipe(
    prop('channels'),
    prop('entities'),
    defaultTo([]),
  )),
)

const ChannelsContainer = ({ children }) => (
  <Query query={ query }>
    { pipe(normalize, children) }
  </Query>
)

ChannelsContainer.propTypes = {
  children: func,
}

export default ChannelsContainer
