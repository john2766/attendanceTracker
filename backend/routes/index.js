const express = require('express');
router = express.Router()

const Sidebar = require('./sidebar.js')
const ClassForm = require('./newClassForm')
const LiveClass = require('./liveClass.js')
const Class = require('./class.js')
const Account = require('./account.js')
const VerifyToken = require('./auth.js')

router.use(Sidebar)
router.use(ClassForm)
router.use(LiveClass)
router.use(Class)
router.use(Account)
router.use(VerifyToken)

module.exports = router