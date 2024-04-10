const db = require('../models/db')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const secretKey = process.env.API_KEY

router.post('/signup', jsonParser, async (req, res) => {
    console.log('signup')
    try {
        hashedPassword = await argon2.hash(req.body.password)
        if (hashedPassword != null) {
            db.all('INSERT INTO instructorData VALUES (?,?)', req.body.username, hashedPassword, (err, data) => {
                if(err) {
                    console.error(err.message)
                }
            })
        }
    }
    catch(err) {
        console.log(err.message)
    }
})

router.post('/login', jsonParser, async (req, res) => {
    console.log("login")
    var hashedPassword
    db.all('SELECT password FROM instructorData WHERE username = ?', req.body.username, async (err, data) => {
        if(err) {
            console.error(err.message)
            return
        }
        else {
            hashedPassword = data[0].password
            if(await argon2.verify(hashedPassword, req.body.password)) {
                const token = jwt.sign({ userId: req.body.username }, secretKey, { expiresIn: '1h', });
                res.status(200).json({ token })
            }
            else {
                res.status(401).json({ error: 'No match with existing user' })
                console.log("no match")
            }
        }
    })
})

module.exports = router