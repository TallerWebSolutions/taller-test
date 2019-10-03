import React from 'react'
import { func } from 'prop-types'
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

const NewMessageContainer = ({ children }) => (
  <Mutation mutation={ mutation } refetchQueries={ ['Channels'] }>
    { mutate => (
      children(name => {
        if (name) {
          mutate({ variables: { name } })
        }
      })
    ) }
  </Mutation>
)

NewMessageContainer.propTypes = {
  children: func,
}

export default NewMessageContainer
