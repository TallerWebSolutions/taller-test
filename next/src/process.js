/**
 * This file overrides the default require('process') to inject
 * environment variables when available.
 */

import objectPath from 'object-path'

if (process.browser && window.envConfig) {
  Object.keys(window.envConfig).forEach(path => {
    objectPath.set({ process }, path, window.envConfig[path])
  })
}

export default process
