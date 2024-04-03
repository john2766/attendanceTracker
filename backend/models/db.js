const sqlite3 = require('sqlite3').verbose()

// Connect to the database
let db = new sqlite3.Database('./models/rfidData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
    console.log("Connected to database")
})

module.exports = db