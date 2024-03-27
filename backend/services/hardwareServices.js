const db = require('../models/db')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const express = require('express');
const router = express.Router();

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

module.exports = router