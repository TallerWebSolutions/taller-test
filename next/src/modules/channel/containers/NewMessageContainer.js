import React from 'react'
import { func, shape, number } from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Form, Field } from 'react-final-form'

const mutation = gql`
  mutation CreateMessage ($user: String!, $channel: String!, $body: String!) {
    createMessageMessage(input: {
      userId: { targetId: $user }
      body: { value: $body }
      channel: { targetId: $channel }
    }) {
      errors
      violations {
        message
        path
        code
      }
      entity {
        entityId
      }
    }
  }
`

// @TODO: implement optimistic query on messages?

const NewMessageContainer = ({ children, user, channel }) => (
  <Mutation mutation={ mutation } refetchQueries={ ['Messages'] }>
    { send => (
      <Form
        children={ children }
        onSubmit={ ({ body }, { reset }) => {
          reset()

          send({
            variables: {
              body,
              user: user.uid,
              channel: channel.tid
            }
          })
        } }
      />
    ) }
  </Mutation>
)

NewMessageContainer.propTypes = {
  children: func,
  user: shape({ uid: number.isRequired }).isRequired,
  channel: shape({ tid: number.isRequired }).isRequired,
}

/**
 * Composable message field.
 */
NewMessageContainer.Message = props => (
  <Field name='body' { ...props } />
)

export default NewMessageContainer
