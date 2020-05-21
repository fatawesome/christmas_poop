const express = require('express')
const companion = require('@uppy/companion')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

app.use(bodyParser.json())
app.use(session({
    secret: 'some-secret',
    resave: true,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, Content-Type, Accept'
    )
    next()
})

// Routes
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.send('Welcome to Companion')
})

// initialize uppy
const uppyOptions = {
    providerOptions: {
        google: {
            key: 'your google key',
            secret: 'your google secret'
        },
        instagram: {
            key: 'your instagram key',
            secret: 'your instagram secret'
        }
        // you can also add options for dropbox here
    },
    server: {
        host: 'localhost:3005',
        protocol: 'http'
    },
    secret: 'some-secret',
    filePath: "./output",
    sendSelfEndpoint: "localhost:3005",
    debug: true
}

app.use(companion.app(uppyOptions))

// handle 404
app.use((req, res) => {
    return res.status(404).json({ message: 'Not Found' })
})

// handle server errors
app.use((err, req, res) => {
    console.error('\x1b[31m', err.stack, '\x1b[0m')
    res.status(err.status || 500).json({ message: err.message, error: err })
})

companion.socket(app.listen(3005), uppyOptions)

console.log('Welcome to Companion!')
console.log(`Listening on http://0.0.0.0:${3005}`)
