const express = require('express');
const db = require('../models/db')
const bodyParser = require('body-parser')
// var jsonParser = bodyParser.json()
router = express.Router()

const Sidebar = require('./sidebar.js')
const ClassForm = require('./newClassForm')
const LiveClass = require('./liveClass.js')
const Class = require('./class.js')
const verifyToken = require('./auth.js')

router.use(Sidebar)
router.use(ClassForm)
router.use(LiveClass)
router.use(Class)
router.use(verifyToken)

module.exports = router