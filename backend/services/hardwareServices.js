const db = require('../models/db')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'chan.ng.cashin@gmail.com',
        pass: 'yqna uzmx mtoh iscm',
    },
});
    
const mailDetails = {
    from: 'chan.ng.cashin@gmail.com',
    to: '',
    subject: 'Confirmation Email',
    text: 'Your attendance is being tracked'
};

// if this doesn't work, try changing '/sensor_data_time_in' with '/service/sensor_data_time_in'
router.post("/sensor_data_time_in", jsonParser, (req, res) => {
    var id
    var email
    db.all('SELECT id, email FROM studentData WHERE rfidToken = ?', req.body.id, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            console.log("DATA = ", data)
            console.log(data[0].id)
            id = data[0].id
            email = data[0].email

            db.all('INSERT INTO POTR063 VALUES (?, ?, ?)', id, req.body.timeIn, req.body.timeOut, (err, data) => {
                if (err) {
                    console.error(err.message)
                    res.send(err.message)
                }
                else {
                    mailDetails['to'] = email
                    transporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            console.log('Error Occurs');
                            console.error(err.message)
                        } else {
                            console.log('Email sent successfully');
                        }
                    });
                    console.log(req.body)
                    res.send('time in success')
                }
            })
        }
    })
})

router.post("/sensor_data_time_out", jsonParser, (req, res) => {
    var id
    db.all('SELECT id FROM studentData WHERE rfidToken = ?', req.body.id, (err, data) => {
        if (err) {
            console.error(err.message)
            res.send(err.message)
        }
        else {
            console.log("DATA = ", data)
            console.log(data[0].id)
            id = data[0].id

            db.all('UPDATE POTR063 SET timeOut = ? WHERE id = ? and timeOut is null', req.body.timeOut, id, (err, data) => {
                if (err) {
                    console.error(err.message)
                    res.send(err.message)
                }
                else {
                    console.log(req.body)
                    res.send('time out success')
                }
            })
        }
    })
})

module.exports = router