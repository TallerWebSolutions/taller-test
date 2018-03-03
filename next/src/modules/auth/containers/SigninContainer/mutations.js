import gql from 'graphql-tag'

export const loginMutation = gql`
  mutation UserLogin($email: String!, $password: String!) {
    user: userLogin (username: $email, password: $password) {
      name
    }
  }
`

export const registerMutation = gql`
  mutation UserRegister($email: String!, $password: String!) {
    user: userRegister (username: $email, password: $password) {
      name
    }
  }
`
