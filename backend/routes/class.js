const db = require('../models/db')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// Class.js: Display class roster for given className
router.get("/roster", (req, res) => {
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
router.post("/update_attendance", jsonParser, (req, res) => {
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
router.post("/upload_roster", jsonParser, (req, res) => {
    console.log("/upload_roster")
    for (i in req.body.roster) {
        roster = req.body.roster[i]
        console.log("query i = ", req.body.roster[i])
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
router.post("/student_delete", jsonParser, (req, res) => {
    console.log(req.body.id)
    db.all("DELETE FROM attendance WHERE id = ? AND className = ?", req.body.id, req.body.className, (err, data) => {
        if (err) {
            console.error(err.message)
        }
    })
})

// Class.js: Delete class
router.post("/class_delete", jsonParser, (req, res) => {
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
router.get("/all_students", (req, res) => {
    console.log("all_students")
    db.all("SELECT id, nameFirst, nameLast, email FROM studentData WHERE id NOT IN (SELECT id FROM attendance WHERE className = ?)", req.query.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
            res.send(data)
        }
    })
})

// Class.js: Add new student to class
router.post("/student_add", jsonParser, (req, res) => {
    console.log("student_add")
    db.all("INSERT INTO attendance (id, className, attendances) VALUES (?,?,0)", req.body.id, req.body.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
           res.send('success')
        }
    })
})

// Class.js: Display class information
router.get("/class_info", (req, res) => {
    console.log("class_info")
    db.all("SELECT * FROM classData WHERE className = ?", req.query.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
            res.send(data)
        }
    })
})

module.exports = router