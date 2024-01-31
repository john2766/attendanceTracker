const express = require('express');
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const app = express()

let db = new sqlite3.Database('./database/rfidData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
    console.log("Connected to database")
})

app.use(cors())

const PORT = 3001

app.get("/users_list", (req, res) => {
    db.all('SELECT * FROM userData ORDER BY NameLast', [], (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        console.log("users list")
        res.send(data)
    })
})

app.get("/time_stamp_list", (req, res) => {
    //change to take input that allows table name to be altered based on classroom
    db.all('SELECT * FROM timeLogC1', [], (err, data) => {
        if (err){
            console.error(err.message)
            res.send(err.message)
        }
        console.log("time stamp list")
        res.send(data)
    })
})

app.get("/create_table", (req, res) => {
    console.log(req)
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });