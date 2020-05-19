import React from 'react'
import PropTypes from 'prop-types'
import { Form, Field } from 'react-final-form'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import { combine, condition, required, minLength, email, equalsField } from 'app/lib/form/validation'

import { loginMutation, registerMutation } from './mutations'

export const labels = {
  name: 'Username',
  email: 'E-mail',
  password: 'Password',
  passwordConfirm: 'Confirm password',
}

const validations = {
  name: combine([required]),
  email: combine([required, email]),
  password: combine([required, minLength(6)]),
  passwordConfirm: condition(
    (value, { register }) => register,
    [required, equalsField('password', labels.password)],
  )
}

/**
 * Grab actual error from GraphQL error.
 */
const normalizeError = err => err.graphQLErrors ? err.graphQLErrors[0].message : err.message

/**
 * Redirect when registered/logged in.
 */
const redirect = () => {
  Router.push('/channel', '/messages/general')
  return undefined
}

/**
 * Submit handler: switch between register and login based on form values.
 */
const handleSubmit = ({ register, login }) => variables =>
  (variables.register ? register : login)({ variables })
    .then(redirect)
    .catch(normalizeError)

const SigninContainer = ({ children }) => (
  <Mutation mutation={ loginMutation }>
    { login => (
      <Mutation mutation={ registerMutation }>
        { register => (
          <Form
            children={ children }
            onSubmit={ handleSubmit({ register, login }) }
          />
        ) }
      </Mutation>
    ) }
  </Mutation>
)

/**
 * Composable name field.
 */
SigninContainer.Username = props => (
  <Field
    name='name'
    validate={ validations.name }
    { ...props }
  />
)

/**
 * Composable e-mail field.
 */
SigninContainer.Email = props => (
  <Field
    name='email'
    validate={ validations.email }
    { ...props }
  />
)

/**
 * Composable password field.
 */
SigninContainer.Password = props => (
  <Field
    name='password'
    type='password'
    validate={ validations.password }
    { ...props }
  />
)

/**
 * Composable password-confirm field.
 */
SigninContainer.PasswordConfirm = props => (
  <Field
    name='passwordConfirm'
    type='password'
    validate={ validations.passwordConfirm }
    validateFields={ ['password'] }
    { ...props }
  />
)

/**
 * Composable register field.
 */
SigninContainer.Register = props => (
  <Field name='register' { ...props } />
)

SigninContainer.propTypes = {
  children: PropTypes.func,
}

export default SigninContainer
