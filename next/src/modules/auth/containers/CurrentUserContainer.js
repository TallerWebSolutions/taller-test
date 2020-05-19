import React from 'react'
import { func } from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import { isClient } from 'app/lib/func'

const query = gql`
  query CurrentUser {
    user: currentUserContext {
      ... on UserUser {
        uid
        mail
        name
      }
    }
  }
`

let refetchedOnClient = false

const CurrentUserContainer = ({ children }) => (
  <Query query={ query }>
    { ({ loading, error, data, refetch, ...result }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      // Force a refetch on the client inside to make sure
      // the cached SSR anonymous user is replaced, in case
      // the user is already logged in..
      if (!loading && !refetchedOnClient && isClient()) {
        refetchedOnClient = true
        refetch()
      }

      return children({ user: data.user, ...result })
    } }
  </Query>
)

CurrentUserContainer.propTypes = {
  children: func,
}

export default CurrentUserContainer
