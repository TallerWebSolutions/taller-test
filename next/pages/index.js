import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import App from 'grommet/components/App'
import Box from 'grommet/components/Box'
import Image from 'grommet/components/Image'
import Headline from 'grommet/components/Headline'
import ChatIcon from 'grommet/components/icons/base/Chat'

import Form from 'grommet/components/Form'
import Heading from 'grommet/components/Heading'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import FormField from 'grommet/components/FormField'

import bootstrap from 'app/lib/bootstrap'
import SigninContainer, { labels } from 'app/modules/auth/containers/SigninContainer'

import TextInput from 'app/modules/form/components/TextInput'
import CheckBox from 'app/modules/form/components/CheckBox'

const StyledImage = styled(Image)`
  width: auto;
  margin-bottom: 2rem;
`

const SignInPage = () => (
  <App>
    <Box full='vertical' justify='center' align='center' pad={ { vertical: 'large' } }>
      <StyledImage src='/static/logo.png' />

      <Headline>Welcome to the <b>TallerChat</b> <ChatIcon size='large' colorIndex='critical' /></Headline>

      <SigninContainer>
        { ({ ...form, handleSubmit, submitting, invalid, values: { register } }) => (
          <Form pad='medium' onSubmit={ handleSubmit }>
            <Heading strong tag='h2' align='center'>Sign In</Heading>

            <fieldset>
              <FormField label={ labels.name }>
                <SigninContainer.Username
                  autoFocus
                  disabled={ submitting }
                  component={ TextInput }
                />
              </FormField>

              { register && (
                <FormField label={ labels.email }>
                  <SigninContainer.Email
                    disabled={ submitting }
                    component={ TextInput }
                  />
                </FormField>
              ) }

              <FormField label={ labels.password }>
                <SigninContainer.Password
                  disabled={ submitting }
                  component={ TextInput }
                />
              </FormField>

              { register && (
                <FormField label={ labels.passwordConfirm }>
                  <SigninContainer.PasswordConfirm
                    disabled={ submitting }
                    component={ TextInput }
                  />
                </FormField>
              ) }
            </fieldset>

            <Box margin={ { bottom: 'medium' } }>
              <SigninContainer.Register
                label="I'm new here"
                disabled={ submitting }
                component={ CheckBox }
              />
            </Box>

            <Errors { ...form } />

            <Footer size='small' direction='column' align='center' pad={ { between: 'medium' } }>
              <Button fill primary
                type='submit'
                label={ register ? (submitting ? 'Registering...' : 'Register') : (submitting ? 'Logging...' : 'Log In') }
                disabled={ invalid || submitting }
              />
            </Footer>
          </Form>
        ) }
      </SigninContainer>
    </Box>
  </App>
)

const ErrorBox = styled(Box)`
  ul {
    margin: 0 0 0 1.5rem;
  }
`

/**
 * Component to show form errors.
 */
const Errors = ({ errors, submitErrors, touched }) => {
  const errorMessages = Object.keys(errors)
    .filter(field => touched[field])
    .map(field => [labels[field], errors[field]])

  return (
    <React.Fragment>
      { submitErrors && (
        <ErrorBox colorIndex='critical' pad='small' margin={ { vertical: 'small' } }>
          { submitErrors }
        </ErrorBox>
      ) }

      { !!errorMessages.length && (
        <ErrorBox colorIndex='critical' pad='small' margin={ { vertical: 'small' } }>
          <ul>
            { errorMessages.map(([label, error]) => (
              <li key={ label }>{ label }: <i>{ error }</i></li>
            )) }
          </ul>
        </ErrorBox>
      ) }
    </React.Fragment>
  )
}

Errors.propTypes = {
  errors: PropTypes.object,
  submitErrors: PropTypes.string,
  touched: PropTypes.object,
}

export default bootstrap(SignInPage)
