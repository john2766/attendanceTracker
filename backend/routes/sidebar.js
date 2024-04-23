const db = require('../models/db')
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware')

// Sidebar.js: Get all classes for a given professor
router.get('/classes', verifyToken, (req, res) => {
    console.log("getting classes")
    db.all('SELECT className FROM classData WHERE username= ?', req.userId, (err, data) => {
        if (err){
            console.error(err.message)
            res.send(err.message)
        }
        else {
            console.log("data = ", data)
            res.send(data)
        }
    })
})

module.exports = router