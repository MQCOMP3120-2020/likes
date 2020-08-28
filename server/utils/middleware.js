
const requestLogger = (request, response, next) => {
    console.log(request.method, request.path)
    console.log(request.body)
    console.log('---')
    next()
}


const errorMiddleware = (error, request, response, next) => {
    console.log("ERROR", error.name)
    response.status(500).send({error: error.name})
    next()
}


module.exports = {requestLogger, errorMiddleware}