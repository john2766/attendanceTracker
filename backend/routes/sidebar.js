const db = require('../models/db')
const express = require('express');
const router = express.Router();

// Sidebar.js: Get all classes for a given professor
router.get('/classes', (req, res) => {
    console.log("getting classes")
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

module.exports = router