// const db = require('../models/db')
const verifyToken = require('../middleware/authMiddleware')
const express = require('express')
const router = express.Router()

router.get('/account', verifyToken, (req, res) => {
    res.send(req.userId)
})

module.exports = router