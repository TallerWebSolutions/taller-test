module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: [/__tests__/, /\.test.js$/],
      loader: 'ignore-loader'
    })

    /**
     * Allows for injection of CSS as text. Useful for third party CSS loading.
     * Use "injectGlobal" from "styled-components" to add these to the page.
     */
    config.module.rules.push({
      test: /\.css$/,
      use: [
        { loader: 'emit-file-loader', options: { name: 'dist/[path][name].[ext]' } },
        'babel-loader',
        'raw-loader'
      ]
    })

    return config
  }
}
