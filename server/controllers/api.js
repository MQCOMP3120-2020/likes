const express = require('express') 
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs") 
const Like = require("../models/likes")

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

    Like.find({}).then(result => {
        res.json(result)
    })
})

apiRouter.get('/api/likes/:id', (req, res) => {

    Like.findById(req.params.id)
        .then(result => {
            res.json(result)
        })
        .catch(() => {
            res.status(404).json({error: "Not found"})
        })
})

apiRouter.post('/api/likes', (req, res) => {

    const token = getTokenFrom(req)
    let decodedToken = null

    try {
        decodedToken = jwt.verify(token, SECRET)
    }
    catch (error) {
        decodedToken = {id: null}
    }

    if (!token || !decodedToken.id) {
        return res.status(401).json({error: "invalid token"})
    }

    const body = req.body

    const newLike = new Like({
        content: body.content,
        votes: 0,
        user: decodedToken.id
    })
    newLike.save().then(result => {
        res.json(result)
    })
})

apiRouter.put('/api/likes/:id', (req, res) => {

    const newLike = {
        content: req.body.content,
        votes: req.body.votes,
    }
    
    Like.findByIdAndUpdate(req.params.id, newLike, {new: true})
    .then(result => {
        res.json(result)
    })   
})

// handle post request for login with {username, password}
apiRouter.post('/auth/login', async (req, res) => {

    const {username, password} = req.body

    const user = getUser(username)

    if (!user) {
        return res.status(401).json({error: "invalid username or password"})
    }

    if (await bcrypt.compare(password, user.password)) {
        
        const userForToken = {
            id: user.id,
            username: user.username            
        }
        let token = null
        try {
            token = jwt.sign(userForToken, SECRET)
        } 
        catch (error) {
            return res.status(401).json({error: "invalid token"})
        }

        // store the token in the user session
        req.session.token = token
        return res.status(200).json({token, username: user.username, name: user.name})
        
    } else {
        return res.status(401).json({error: "invalid username or password"})
    }

})


// handle post request for login with {username, password}
apiRouter.get('/auth/refresh', async (req, res) => {

    if (req.session.token) {
        const decoded = jwt.verify(req.session.token, SECRET)
        const user = getUser(decoded.username)

        return res.status(200).json({token: req.session.token, username: user.username, name: user.name})
    } else {
        return res.status(401).json({error: "no or invalid cookie"})
    }
})

module.exports = apiRouter
