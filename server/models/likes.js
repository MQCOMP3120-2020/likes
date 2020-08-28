const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    content: String,
    votes: Number,
    user: Number
})

const Like = mongoose.model("Like", likeSchema)

module.exports = Like

