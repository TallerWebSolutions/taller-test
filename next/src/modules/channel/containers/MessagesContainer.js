import { pipe, defaultTo, map, prop, over, lensProp } from 'ramda'
import React from 'react'
import { func, shape, number } from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading'
import AlertIcon from 'grommet/components/icons/base/Alert'

import { rename } from 'app/lib/func'

const query = gql`
  query Messages ($channel: String!) {
    messages: messageQuery(
      limit: 50
      filter: {
        conditions: [{
          field: "channel"
          value: [$channel]
        }]
      }
    ) {
      count
      entities {
        id
        author: entityOwner {
          name
        }
        ... on Message {
          message: body {
            value
          }
        }
      }
    }
  }
`

const normalizeMessage = pipe(
  over(lensProp('author'), prop('name')),
  over(lensProp('message'), prop('value')),
)

const normalize = pipe(
  rename('data', 'messages'),
  over(lensProp('messages'), pipe(
    prop('messages'),
    prop('entities'),
    defaultTo([]),
    map(normalizeMessage)
  )),
)

const MessagesContainer = ({ children, channel }) => (
  channel && channel.tid ? (
    <Query query={ query } variables={ { channel: channel.tid } }>
      { pipe(normalize, children) }
    </Query>
  ) : (
    <Box full='vertical' justify='center' align='center'>
      <AlertIcon size='large' colorIndex='critical' />
      <Heading tag='h2'>This channel does not exist :(</Heading>
    </Box>
  )
)

MessagesContainer.propTypes = {
  children: func,
  channel: shape({
    tid: number.isRequired
  })
}

export default MessagesContainer
