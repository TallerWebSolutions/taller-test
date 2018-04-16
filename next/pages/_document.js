import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import envConfig from '../env-config'

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App { ...props } />))
    const styleTags = sheet.getStyleElement()

    /**
     * We won't really use "page" object because Head, Main, and NextScript already
     * cover injecting the output content to the page.
     */
    return { ...page, styleTags }
  }

  render () {
    return (
      <html>
        <Head>
          <meta httpEquiv='x-ua-compatible' content='ie=edge' />

          <title>TallerChat</title>

          <meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no' />
          <link rel='icon' type='image/png' href='/static/favicon.png' />
          <link key='grommet-css' href='//cdnjs.cloudflare.com/ajax/libs/grommet/1.0.1/grommet.min.css' rel='stylesheet' type='text/css' />

          <script dangerouslySetInnerHTML={ { __html: `window.envConfig = ${JSON.stringify(envConfig)}` } } />

          { this.props.styleTags }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
