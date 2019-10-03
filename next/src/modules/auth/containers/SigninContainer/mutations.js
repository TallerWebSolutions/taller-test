import gql from 'graphql-tag'

export const loginMutation = gql`
  mutation UserLogin($name: String!, $password: String!) {
    user: userLogin (name: $name, password: $password) {
      uid
      name
    }
  }
`

export const registerMutation = gql`
  mutation UserRegister($name: String!, $email: String!, $password: String!) {
    user: userRegister (name: $name, email: $email, password: $password) {
      uid
      name
    }
  }
`
