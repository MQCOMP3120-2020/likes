require('dotenv').config()

const express = require('express') 
const cors = require("cors")
const apiRouter = require("./controllers/api")
const middleware = require("./utils/middleware")
var session = require('express-session')

const app = express() 

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    httpOnly: true,
    cookie: {
        path: '/auth', 
        sameSite: 'strict'
    }
  }))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.static('build'))
app.use(apiRouter)
app.use(middleware.errorMiddleware)



module.exports = app
