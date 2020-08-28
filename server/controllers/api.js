const express = require('express') 
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs") 

const SECRET = process.env.SECRET

// Load data from JSON file into memory
const rawData = fs.readFileSync("server/sample.json")
const data = JSON.parse(rawData)

const getUser = (username) => {
    return data.users.filter(u => u.username === username)[0]
}

const getTokenFrom = request => {
    const authorization = request.get('authorization') 
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) { 
           return authorization.substring(7)  
        }  
    return null
}


const apiRouter = express.Router()

apiRouter.get('/api/likes', (req, res) => {
    console.log("GET")
    res.json(data.likes)
})

apiRouter.post('/api/likes', (req, res) => {

    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, SECRET)

    if (!token || !decodedToken.id) {
        return res.status(401).json({error: "invalid token"})
    }

    const body = req.body
    const newLike = {
        content: body.content,
        votes: 0,
        user: decodedToken.id,
        id: data.likes.length   
    }
    data.likes.push(newLike) 
    res.json(newLike)
})

apiRouter.put('/api/likes/:id', (req, res) => {
    const newlike = req.body
    const id = Number(req.params.id)
    data.likes = data.likes.map(e => id === e.id ? newlike : e)
    console.log("updated", newlike)
    res.json(newlike)
})

// handle post request for login with {username, password}
apiRouter.post('/api/login', async (req, res) => {

    const {username, password} = req.body

    const user = getUser(username)
    console.log(user)

    if (!user) {
        return res.status(401).json({error: "invalid username or password"})
    }

    if (await bcrypt.compare(password, user.password)) {
        console.log("Password is good!")
        
        const userForToken = {
            id: user.id,
            username: user.username            
        }
        const token = jwt.sign(userForToken, SECRET)

        return res.status(200).json({token, username: user.username, name: user.name})
        
    } else {
        return res.status(401).json({error: "invalid username or password"})
    }

})

module.exports = apiRouter


