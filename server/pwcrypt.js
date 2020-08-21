const bcrypt = require('bcrypt')
const fs = require("fs")

// Load data from JSON file into memory
const rawData = fs.readFileSync("server/sample.json")
const data = JSON.parse(rawData)

data.users.map(u => {
    const pwcrypt = bcrypt.hash(u.password, 10).then(result => console.log(u.username, result))
})


