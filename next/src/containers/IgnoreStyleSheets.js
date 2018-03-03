import React from 'react'
import PropTypes from 'prop-types'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

/**
 * SSR solutions constantly need to create a virtual tree to collect data,
 * such as Apollo does to perform queries on the server-side. When using
 * multiple of these solutions - styled-components is another case - there
 * might happen a clash of data because of duplicated rendering down the tree.
 *
 * The following component can be used to avoid collecting styled on a virtual
 * tree such as that created to collect Apollo queries results.
 */

export const IgnoreStyleSheets = ({ children }) => (
  <StyleSheetManager sheet={ (new ServerStyleSheet()).instance }>
    { children }
  </StyleSheetManager>
)

IgnoreStyleSheets.propTypes = {
  children: PropTypes.node,
}
