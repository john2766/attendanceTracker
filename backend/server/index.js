const express = require('express');
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Connect to the database
let db = new sqlite3.Database('./database/rfidData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
    console.log("Connected to database")
})

app.use(cors())
const PORT = 3001

app.post("/sensor_data_time_in", jsonParser, (req, res) => {
    db.all('INSERT INTO POTR063 VALUES (?, ?, ?)', req.body.id, req.body.timeIn, req.body.timeOut, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            console.log(req.body)
            res.send('success')
        }
    })
})

app.post("/sensor_data_time_out", jsonParser, (req, res) => {
    db.all('UPDATE POTR063 SET timeOut = ? WHERE id = ? and timeOut is null', req.body.timeOut, req.body.id, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            console.log(req.body)
            res.send('success')
        }
    })
})


// NewClassForm.js: Take form data and create a new class
app.post('/create_class', jsonParser, (req, res) => {
    db.all('INSERT INTO classData VALUES (?,?,?,?,?,?)',
    req.body.className, req.body.username, req.body.startTime, req.body.endTime,
    req.body.classroom, req.body.days, (err, data) => {
        if (err) {
            console.error(err.message)
            res.status(400).send(err.message)
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
            // Handle multiple classes in session at once
            var inSession = 0
            for (i in data){
                // If current time is greater than class start time
                if (new Date((data[i].startTime)).toTimeString() < new Date().toTimeString()
                    & new Date((data[i].endTime)).toTimeString() > new Date().toTimeString()){
                        currDay = weekDays[new Date().getDay()]
                        if (data[i].days.includes(currDay)) {
                            inSession = 1
                            res.send(data[i].className)
                            return // Currently only displays one class if multiple are in session
                        }
                    }
            }
            // If no classes in session, return null
            if (inSession === 0){
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
            WHERE timeOut is null`

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
app.post("/update_attendance", jsonParser, (req, res) => {
    db.all(`UPDATE attendance SET attendances = ? WHERE id = ? AND className = ?`, req.body.newVal, req.body.id, req.body.className, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            res.send("success")
        }
    })
})

// Class.js: Upload a new class roster (will only add students in roster that match those already in studentData)
app.get("/upload_roster", (req, res) => {
    console.log("/upload_roster")
    for (i in req.query.roster) {
        roster = req.query.roster[i]
        console.log("query i = ", req.query.roster[i])
        // match to student in studentData
        db.all('SELECT * FROM studentData WHERE nameFirst = ? AND nameLast = ? AND id = ?', roster['First Name'], roster['Last Name'], roster['Student ID'], (err, data) => {
            if (err) {
                console.error(err.message)
            }
            else {
                if (data.length !== 0) {
                    db.all('INSERT INTO attendance (id, classname, attendances) VALUES (?, ?, 0)', data[0].id, req.query.className, (err, data) => {
                        if (err) {
                            console.error(err.message)
                        }
                    })
                }
            }
        })
    }
})

// Class.js: Delete student from a class
app.get("/student_delete", (req, res) => {
    console.log(req.query.id)
    db.all("DELETE FROM attendance WHERE id = ? AND className = ?", req.query.id, req.query.className, (err, data) => {
        if (err) {
            console.error(err.message)
        }
    })
})

// Class.js: Delete class
app.post("/class_delete", jsonParser, (req, res) => {
    db.all("DELETE FROM classData WHERE className = ?", req.body.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
            db.all("DELETE FROM attendance WHERE className = ?", req.body.className, (err, data) => {
                if (err) {console.error(err.message)}
                else {
                    res.send('success')
                }
            })
        }
    })
})

// Class.js: Get list of all students not already enrolled in className
app.get("/all_students", (req, res) => {
    console.log("all_students")
    db.all("SELECT id, nameFirst, nameLast, email FROM studentData WHERE id NOT IN (SELECT id FROM attendance WHERE className = ?)", req.query.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
            res.send(data)
        }
    })
})

// Class.js: Add new student to class
app.post("/student_add", jsonParser, (req, res) => {
    console.log("student_add")
    console.log("body is: ", req.body)
    db.all("INSERT INTO attendance (id, className, attendances) VALUES (?,?,0)", req.body.id, req.body.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
           res.send('success')
        }
    })
})

// Class.js: Display class information
app.get("/class_info", (req, res) => {
    console.log("class_info")
    db.all("SELECT * FROM classData WHERE className = ?", req.query.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
            res.send(data)
        }
    })
})

// record attendance for each student after a class has ended (present if there for more than 80% of class)
// called by function below
// ***give instructor ability to determine percentage?
function recordAttendance(className) {
    // TODO (Chan)
    return
}

// Logging attendance data
let inSession = []
setInterval(function() {
    // Check if there is a live class for all instructors
    db.all('SELECT * FROM classData', (err, data) => {
        if (err) {
            console.error(err.message)
        }
        else {
            console.log(data)
            for (i in data){
                // If current time is greater than class start time and current time is less than class end time
                if (new Date((data[i].startTime)).toTimeString() < new Date().toTimeString() &
                    new Date((data[i].endTime)).toTimeString() > new Date().toTimeString()){
                    // And if it is the correct day of the week
                    currDay = weekDays[new Date().getDay()]
                    if (data[i].days.includes(currDay)) {
                        // Class in session, push if not already recorded as in session
                        if (!(data[i].className in inSession)) {
                            inSession[data[i].className] = data[i].classroom
                        }
                    }
                }
                // if class has ended
                else if (data[i].className in inSession) {
                    console.log("classname ended = ", data[i].className)
                    inSession.remove(data[i].className)
                    recordAttendance(className)
                }
            }
        }
        console.log(inSession)
    })
}, 900000) // Runs every 15 minutes

// Listen for requests
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})