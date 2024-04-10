const db = require('../models/db')
const verifyToken = require('../middleware/authMiddleware')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// const { verify } = require('argon2');
var jsonParser = bodyParser.json()
const authorize = require('../middleware/authorize')

// Class.js: Display class roster for given className
router.get("/roster", verifyToken, (req, res) => {
    authorize(req.userId, req.query.className, (authed) => {
        console.log("authed = ", authed)
        if (!authed) {
            res.status(401).json({error: 'Permission denied'})
            return
        }
        else
        {
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
        }
    })
})

// Class.js: Change attendance data manually entered by instructor
router.post("/update_attendance", jsonParser, verifyToken, (req, res) => {
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
router.post("/upload_roster", jsonParser, verifyToken, (req, res) => {
    for (i in req.body.roster) {
        roster = req.body.roster[i]
        // match to student in studentData
        db.all('SELECT * FROM studentData WHERE nameFirst = ? AND nameLast = ? AND id = ?', roster['First Name'], roster['Last Name'], roster['Student ID'], (err, data) => {
            if (err) {
                console.error(err.message)
            }
            else {
                if (data.length !== 0) {
                    db.all('INSERT INTO attendance (id, classname, attendances) VALUES (?, ?, 0)', data[0].id, req.body.className, (err, data) => {
                        if (err) {
                            console.error(err.message)
                        }
                    })
                }
            }
        })
    }
    res.send()
})

// Class.js: Delete student from a class
router.post("/student_delete", jsonParser, verifyToken, (req, res) => {
    db.all("DELETE FROM attendance WHERE id = ? AND className = ?", req.body.id, req.body.className, (err, data) => {
        if (err) {
            console.error(err.message)
        }
    })
})

// Class.js: Delete class
// maybe check that req.userId (ie instructor username) corresponds to className
router.post("/class_delete", jsonParser, verifyToken, (req, res) => {
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
    db.all("SELECT id, nameFirst, nameLast, email FROM studentData WHERE id NOT IN (SELECT id FROM attendance WHERE className = ?)", req.query.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
            res.send(data)
        }
    })
})

// Class.js: Add new student to class
router.post("/student_add", jsonParser, (req, res) => {
    db.all("INSERT INTO attendance (id, className, attendances) VALUES (?,?,0)", req.body.id, req.body.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
           res.send('success')
        }
    })
})

// Class.js: Display class information
router.get("/class_info", (req, res) => {
    db.all("SELECT * FROM classData WHERE className = ?", req.query.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
            res.send(data)
        }
    })
})

module.exports = router