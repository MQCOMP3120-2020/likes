
const requestLogger = (request, response, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(request.method, request.path)
        console.log(request.body)
        console.log('---')
    }
    next()
}


const errorMiddleware = (error, request, response, next) => {
    console.log("ERROR", error.name)
    console.log(error.stack)
    response.status(500).send({error: error.name})
    next()
}


module.exports = {requestLogger, errorMiddleware}