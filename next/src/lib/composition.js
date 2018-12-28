import { over, lensPath, omit } from 'ramda'

import { defaultProps, mapProps, withProps } from 'recompose'

/**
 * Higher-Order Component to map a single prop to a new value.
 * @param {String} prop The property to map.
 * @param {Function} mapper The mapper function (monad \o/).
 * @return {Component} React component.
 */
export const mapProp = (prop, mapper = v => v) =>
  withProps(props => ({ [prop]: mapper(props[prop], props) }))

/**
 * Higher-Order Component to map a prop path to a new value.
 * @param {Array} path The property path to map.
 * @param {Function} mapper The mapper function (monad \o/).
 * @return {Component} React component.
 */
export const mapPath = (path, mapper = v => v) =>
  withProps(props => over(lensPath(path), value => mapper(value, props))(props))

/**
 * Higher-Order Component to add a single prop default value.
 * @param {String} prop The property to set default value.
 * @param {*} value The default value.
 * @return {Component} React component.
 */
export const defaultProp = (prop, value) => defaultProps({ [prop]: value })

/**
 * Higher-Order Component to add a single prop based on previous props.
 * @param {String} prop The property to add.
 * @param {Function} mapper The mapper function (monad \o/).
 * @return {Component} React component.
 */
export const withProp = (prop, mapper) => withProps(props => ({
  [prop]: mapper(props)
}))

/**
 * Higher-Order Component to hide a set of props.
 * @param {Array} props The properties to hide.
 * @return {Component} React component.
 */
export const omitProps = props => mapProps(omit(props))

/**
 * Higher-Order Component to hide a given prop.
 * @param {String} prop The property to hide.
 * @return {Component} React component.
 */
export const omitProp = prop => omitProps([prop])
