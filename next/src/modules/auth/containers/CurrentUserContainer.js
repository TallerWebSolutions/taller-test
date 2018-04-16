import React from 'react'
import { func } from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import { isClient } from 'app/lib/func'

const query = gql`
  query CurrentUser {
    user: currentUserContext {
      uid
      name
      mail
    }
  }
`

let refetchedOnClient = false

const CurrentUserContainer = ({ children }) => (
  <Query query={ query }>
    { ({ ...result, loading, refetch, data }) => {
      // Force a refetch on the client inside to make sure
      // the cached SSR anonymous user is replaced, in case
      // the user is already logged in..
      if (!loading && !refetchedOnClient && isClient()) {
        refetchedOnClient = true
        refetch()
      }

      return children({ ...result, user: data.user })
    } }
  </Query>
)

CurrentUserContainer.propTypes = {
  children: func,
}

export default CurrentUserContainer
