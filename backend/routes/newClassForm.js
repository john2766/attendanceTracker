const db = require('../models/db')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// NewClassForm.js: Take form data and create a new class
router.post('/create_class', jsonParser, (req, res) => {
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
router.get('/classrooms', (req, res) => {
    console.log("classForm/classrooms")
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

module.exports = router