/**
 * This file should declare any and only constants needed on both server/client sides.
 *
 * AFTER ALTERING THIS FILE, YOU MUST CLEAR BABEL-LOADER CACHE. I.E:
 * `rm -R node_modules/.cache/babel-loader`
 *
 * For more information on the provided environment variable solution, please refer to
 * the following Next.js' example:
 *
 * https://github.com/zeit/next.js/tree/canary/examples/with-universal-configuration
 *
 * Please, pay special attention to the "Caveats" section.
 */

module.exports = {
  /**
   * @param GraphQL endpoint (full-url).
   */
  'process.env.GRAPHQL_HOST': process.env.GRAPHQL_HOST,
}
