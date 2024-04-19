const db = require('../models/db')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const express = require('express');
const router = express.Router();

// if this doesn't work, try changing '/sensor_data_time_in' with '/service/sensor_data_time_in'
router.post("/sensor_data_time_in", jsonParser, (req, res) => {
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

router.post("/sensor_data_time_out", jsonParser, (req, res) => {
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

// Class.js: Get list of all students not already enrolled in className
router.get("/all_students", (req, res) => {
    db.all("SELECT id, nameFirst, nameLast, email FROM studentData WHERE id NOT IN (SELECT id FROM attendance WHERE className = ?)", req.query.className, (err, data) => {
        if (err) {console.error(err.message)}
        else {
            res.send(data)
        }
    })
})

module.exports = router