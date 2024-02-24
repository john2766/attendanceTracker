const express = require('express');
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

// Connect to the database
let db = new sqlite3.Database('./database/rfidData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
    console.log("Connected to database")
})

app.use(cors())
const PORT = 3001

// Recieve data from ESP32
app.post("/sensor_data", jsonParser, (req, res) => {
    res.send("Success")
})


// NewClassForm.js: Take form data and create a new class
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

// NewClassForm.js: Get list of all classroom tables for dropdown
app.get('/classrooms', (req, res) => {
    db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'attendance'
    AND name != 'classData' AND name != 'instructorData' AND name != 'studentData' `, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            res.send(data)
        }
    })
})

// Sidebar.js: Get all classes for a given professor
app.get('/classes', (req, res) => {
    const prof = req.query.instructor
    db.all('SELECT className FROM classData WHERE username= ?', req.query.instructor, (err, data) => {
        if (err){
            console.error(err.message)
            res.send(err.message)
        }
        else {
            res.send(data)
        }
    })
})

// LiveClass.js: Checks all classes to see if any are currently in session (return className if so)
app.get("/check_live", (req, res) => {
    db.all('SELECT * FROM classData WHERE username = ?', req.query.username, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            // *****ALSO CHECK IF DATE (ie day of the week) IS CORRECT
            var inSession = 0
            for (i in data){
                // If current time is greater than class start time
                if (new Date((data[i].startTime)).toTimeString() < new Date().toTimeString())
                    // And if current time is less than class end time
                    if (new Date((data[i].endTime)).toTimeString() > new Date().toTimeString()){
                        inSession = 1
                        res.send(data[i].className)
                    }
            }
            // If no classes in session, return null
            if (inSession === 0){
                console.log("sending null")
                res.send(null)
            }
        }
    })
})

// LiveClass.js: Display all student from a given className currently in a given classroom
app.get("/live_class_roster", (req, res) => {
    db.all('SELECT classroom FROM classData WHERE className = ?', req.query.class, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            query =
            `SELECT ${data[0].classroom}.*, studentData.id, studentData.nameLast, studentData.nameFirst FROM ${data[0].classroom}
            JOIN studentData ON ${data[0].classroom}.id = studentData.id
            WHERE timeOut IS NULL`

            db.all(query, (err, data) => {
                if (err) {
                    console.error(err.message)
                    res.send(err.message)
                }
                else {
                    res.send(data)
                }
            })
        }
    })
})

// Class.js: Display class roster for given className
app.get("/roster", (req, res) => {
    db.all(
        `SELECT attendance.*, studentData.id, studentData.nameLast, studentData.nameFirst
        FROM attendance
        JOIN studentData ON attendance.id = studentData.id
        WHERE className = ?`,
        req.query.className, (err, data) => {
            if (err) {
                console.error(err.message)
                res.send(err.message)
            }
            else {
                res.send(data)
            }
    })
})

// Class.js: Change attendance data manually entered by instructor
app.get("/update_attendance", (req, res) => {
    db.all(`UPDATE attendance SET attendances = ? WHERE id = ? AND className = ?`, req.query.newVal, req.query.id, req.query.className, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            res.send("success")
        }
    })
})

// Class.js: Upload a new class roster
app.get("/upload_roster", (req, res) => {
    // assumes all csv entries contain valid students (ie already in studentData)
    console.log("/upload_roster")
    for (i in req.query.roster) {
        roster = req.query.roster[i]
        console.log("query i = ", req.query.roster[i])
        // match to student in studentData
        db.all('SELECT * FROM studentData WHERE nameFirst = ? AND nameLast = ? AND id = ?', roster['First Name'], roster['Last Name'], roster['Student ID'], (err, data) => {
            if (err) {
                console.log("error")
                console.error(err.message)
            }
            else {
                console.log("success")
                if (data.length !== 0) {
                    db.all('INSERT INTO attendance (id, classname, attendances) VALUES (?, ?, 0)', data[0].id, req.query.className, (err, data) => {
                        if (err) {
                            console.error(err.message)
                        }
                        else {
                            console.log("insert success")
                        }
                    })
                }
            }
        })
    }
})

// Listen for requests
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})