import * as R from 'ramda'

/**
 * Empty function. Commonly used for default func properties.
 */
export const noop = () => {}

/**
 * Higher-order function to stop event propagations.
 */
export const stopPropagation = fn => (event, ...args) => {
  if (event) event.stopPropagation()
  return fn ? fn(event, ...args) : undefined
}

/**
 * Higher-order function to prevent event handler defaults.
 */
export const preventDefault = fn => (event, ...args) => {
  if (event) event.preventDefault()
  return fn ? fn(event, ...args) : undefined
}

/**
 * Helper method to both stop propagation and prevent default for event handlers.
 */
export const finishEvent = R.compose(stopPropagation, preventDefault)

/**
 * Renames a property on a given object.
 *
 * @param {String} from Original property name.
 * @param {String} to New property name.
 * @param {Object} object The object to apply the renaming.
 * @return {Object} return The resulting object.
 */
export const rename = R.curry(
  (from, to, obj) => obj
    ? R.omit([from], { ...obj, [to]: obj[from] })
    : obj
)

/**
 * Function version of throw, to facilitate composition.
 *
 * @param {Object} err Object (usually an error) to be thrown.
 * @throws {Object} err.
 */
export const launch = err => {
  throw err
}

/**
 * Rethrow composition helper.
 *
 * @param {Function} fn Function to call.
 * @param {Error} err Thrown error.
 * @return void
 */
export const rethrow = R.pipe(
  R.prepend(R.__, [launch]),
  R.juxt
)

/**
 * Flatten an object's prop.
 * @param {String} prop.
 * @param {Object} object.
 * @return {Object} object.
 */
export const flatten = R.curry((prop, { [prop]: toFlatten, ...object }) => ({ ...object, ...toFlatten }))

/**
 * Check if code is running on the client.
 *
 * If process is available (Next), check if it has a property "browser".
 * Otherwise, check if a window object is available.
 */
export const isClient = () => typeof process !== 'undefined'
  ? !!process.browser
  : typeof window !== 'undefined'

/**
 * Check if code is running on the server.
 */
export const isServer = R.complement(isClient)

/**
 * Check if code is running on production mode.
 */
export const isProduction = () => typeof process !== 'undefined' && process.env.NODE_ENV === 'production'

/**
 * Check if code is running on development mode.
 */
export const isDevelopment = R.complement(isProduction)
