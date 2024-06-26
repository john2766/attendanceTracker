const express = require('express');
const router = express.Router()
const db = require('../models/db');
const verifyToken = require('../middleware/authMiddleware');
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// LiveClass.js: Checks all classes to see if any are currently in session (return className if so)
router.get("/check_live", verifyToken, (req, res) => {
    db.all('SELECT * FROM classData WHERE username = ?', req.userId, (err, data) => {
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
router.get("/live_class_roster_present", verifyToken, (req, res) => {
    db.all('SELECT classroom FROM classData WHERE className = ?', req.query.class, (err, data) => {
        if (err) {
            console.error("present roster classroom error: ", err.message)
            res.send(err.message)
        }
        else {
            query =
            `SELECT DISTINCT attendance.id, studentData.*
            FROM attendance
            INNER JOIN studentData ON attendance.id = studentData.id
            WHERE attendance.id IN (
                SELECT id FROM ${data[0].classroom} WHERE timeOut IS NULL
            )
            AND attendance.className = "${req.query.class}"`

            db.all(query, (err, data) => {
                if (err) {
                    console.error("present roster data error: ", err.message)
                    res.send(err.message)
                }
                else {
                    res.send(data)
                }
            })
        }
    })
})

// LiveClass.js: Display all student from a given className currently not in a given classroom
router.get("/live_class_roster_absent", verifyToken, (req, res) => {
    db.all('SELECT classroom FROM classData WHERE className = ?', req.query.class, (err, data) => {
        if (err) {
            console.error("absent roster classroom error: ", err.message)
            res.send(err.message)
        }
        else {
            query = `SELECT DISTINCT attendance.id, studentData.*
            FROM attendance
            INNER JOIN studentData ON attendance.id = studentData.id
            WHERE attendance.id NOT IN (
                SELECT id FROM ${data[0].classroom} WHERE timeOut IS NULL
            )
            AND attendance.className = "${req.query.class}"`

            db.all(query, (err, data) => {
                if (err) {
                    console.error("absent roster data error: ", err.message)
                    res.send(err.message)
                }
                // get all students who are not in data
                else {
                    res.send(data)
                }
            })
        }
    })
})

module.exports = router