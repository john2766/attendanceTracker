const express = require('express');
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

let db = new sqlite3.Database('./database/rfidData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
    console.log("Connected to database")
})

app.use(cors())
const PORT = 3001

app.post("/sensor_data", jsonParser, (req, res) => {
    console.log(req.body)
    res.send("Success")
})

app.get("/users_list", (req, res) => {
    db.all('SELECT * FROM userData ORDER BY nameLast', [], (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        console.log("users list")
        res.send(data)
    })
})


app.get('/create_class', (req, res) => {
    db.all('INSERT INTO classData VALUES (?,?,?,?,?,?)',
    req.query.className, req.query.username, req.query.startTime, req.query.endTime,
    req.query.classroom, req.query.days, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            res.send('success')
        }
    });

})

// Get all classes for a given professor
app.get('/classes', (req, res) => {
    const prof = req.query.instructor
    db.all('SELECT className FROM classData WHERE username= ?', req.query.instructor, (err, data) => {
        if (err){
            console.error(err.message)
            res.send(err.message)
        }
        else {
            console.log("classes")
            res.send(data)
        }
    })
})

app.get("/check_live", (req, res) => {
    db.all('SELECT * FROM classData WHERE username = ?', req.query.username, (err, data) => {
        if (err) {
            console.error(err.messsage)
            res.send(err.message)
        }
        else {
            // *****ALSO CHECK IF DATE IS CORRECT
            // console.log(data)
            var inSession = 0
            for (i in data){
                // If current time is greater than class start time
                if (new Date((data[i].startTime)).toTimeString() < new Date().toTimeString())
                    console.log("true")

                    // And if current time is less than class end time
                    if (new Date((data[i].startTime)).toTimeString() < new Date().toTimeString()){
                        console.log("class in session: ", data[i].className)
                        inSession = 1
                        res.send(data[i].className)
                    }
                else console.log("class not in session: ", data[i].className)
            }
            // If no classes in session, return null
            if (inSession === 0){
                res.send(null)
            }
        }
    })
})

app.get("/live_class_roster", (req, res) => {
    console.log('/live class roster')
    db.all('SELECT classroom FROM classData WHERE className = ?', req.query.class, (err, data) => {
        if (err) {
            console.error(err.messsage)
            res.send(err.message)
        }
        else {
            query =
            `SELECT ${data[0].classroom}.*, studentData.id, studentData.nameLast, studentData.nameFirst FROM ${data[0].classroom}
            JOIN studentData ON ${data[0].classroom}.id = studentData.id
            WHERE timeOut IS NULL`

            db.all(query, (err, data) => {
                if (err) {
                    console.error(err.messsage)
                    res.send(err.message)
                }
                else {
                    res.send(data)
                }
            })
        }
    })
})

// Listen for requests
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });