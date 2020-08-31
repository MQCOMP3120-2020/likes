require("dotenv").config()
const mongoose = require("mongoose")
const Like = require("./models/likes")
const fs = require("fs")

// Load data from JSON file into memory
const rawData = fs.readFileSync("server/sample.json")
const data = JSON.parse(rawData)

data.likes.map(record => {

    console.log(record)
    const newLike = new Like({
        content: record.content,
        votes: record.votes,
        user: record.user
    })
    newLike.save().then(result => {
        console.log("like record saved")
    })
})

// mongoose.connection.close()
