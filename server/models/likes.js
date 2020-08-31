const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
        console.log('connected to MongoDB')  
    })  
    .catch((error) => {    
        console.log('error connecting to MongoDB:', error.message)
    })

const likeSchema = new mongoose.Schema({
    content: String,
    votes: Number,
    user: Number
})

likeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Like = mongoose.model("Like", likeSchema)

module.exports = Like

