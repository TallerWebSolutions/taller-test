const express = require('express')
const next = require('next')
const apicache = require('apicache')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })

app.prepare()
  .then(() => {
    const server = express()

    if (process.env.CACHE_SSR) {
      server.use(apicache.middleware('5 minutes'))
    }

    server.get('/messages/:channel', (req, res) => {
      app.render(req, res, '/channel', req.params)
    })

    // Next.js default handler.
    server.get('*', app.getRequestHandler())

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
