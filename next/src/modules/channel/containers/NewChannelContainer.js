import React from 'react'
import { func, array } from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const mutation = gql`
  mutation CreateChannel ($name: String!) {
    createTaxonomyTermChannel (input: { name: $name }) {
      violations {
        message
        path
        code
      }
      errors
      entity {
        entityId
      }
    }
  }
`

// @TODO: implement optimistic query on channels?

const NewMessageContainer = ({ children, channels }) => (
  <Mutation mutation={ mutation } refetchQueries={ ['Channels'] }>
    { mutate => (
      children(name => {
        if (name) {
          if (channels.find(channel => channel.name === name)) {
            window.alert(`There is already a channel called ${name}! O.o`)
          }
          else {
            mutate({ variables: { name } })
          }
        }
      })
    ) }
  </Mutation>
)

NewMessageContainer.propTypes = {
  children: func,
  channels: array,
}

export default NewMessageContainer
