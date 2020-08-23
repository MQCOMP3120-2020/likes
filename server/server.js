const express = require('express') 
const fs = require("fs") 
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Load data from JSON file into memory
const rawData = fs.readFileSync("server/sample.json")
const data = JSON.parse(rawData)

const getUser = (username) => {
    return data.users.filter(u => u.username === username)[0]
}


const app = express() 

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/api/likes', (req, res) => {
    console.log("GET")
    res.json(data.likes)
})

app.post('/api/likes', (req, res) => {
    const body = req.body
    const newLike = {
        content: body.content,
        votes: 0,
        id: data.likes.length   
    }
    data.likes.push(newLike) 
    res.json(newLike)
})

app.put('/api/likes/:id', (req, res) => {
    const newlike = req.body
    const id = Number(req.params.id)
    data.likes = data.likes.map(e => id === e.id ? newlike : e)
    console.log("updated", newlike)
    res.json(newlike)
})

// handle post request for login with {username, password}
app.post('/api/login', async (req, res) => {

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
        const token = jwt.sign(userForToken, "secret")

        return res.status(200).json({token, username: user.username, name: user.name})
        
    } else {
        return res.status(401).json({error: "invalid username or password"})
    }

})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})