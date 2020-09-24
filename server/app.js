require('dotenv').config()

const express = require('express') 
const cors = require("cors")
const apiRouter = require("./controllers/api")
const middleware = require("./utils/middleware")

const app = express() 

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.static('build'))
app.use(apiRouter)
app.use(middleware.errorMiddleware)

module.exports = app
