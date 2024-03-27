const express = require('express');
// const app = express()
// const router = express.Router()
const db = require('../models/db')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router = express.Router()

const Sidebar = require('./sidebar.js')
const ClassForm = require('./newClassForm')
const LiveClass = require('./liveClass.js');
const Class = require('./class.js')
// const router = require('./sidebar.js');

router.use(Sidebar)
router.use(ClassForm)
router.use(LiveClass)
router.use(Class)


// // record attendance for each student after a class has ended (present if there for more than 80% of class)
// // called by function below
// // ***give instructor ability to determine percentage?
// function recordAttendance(className) {
//     // TODO (Chan)
//     return
// }

// // Logging attendance data
// let inSession = []
// setInterval(function() {
//     // Check if there is a live class for all instructors
//     db.all('SELECT * FROM classData', (err, data) => {
//         if (err) {
//             console.error(err.message)
//         }
//         else {
//             console.log(data)
//             for (i in data){
//                 // If current time is greater than class start time and current time is less than class end time
//                 if (new Date((data[i].startTime)).toTimeString() < new Date().toTimeString() &
//                     new Date((data[i].endTime)).toTimeString() > new Date().toTimeString()){
//                     // And if it is the correct day of the week
//                     currDay = weekDays[new Date().getDay()]
//                     if (data[i].days.includes(currDay)) {
//                         // Class in session, push if not already recorded as in session
//                         if (!(data[i].className in inSession)) {
//                             inSession[data[i].className] = data[i].classroom
//                         }
//                     }
//                 }
//                 // if class has ended
//                 else if (data[i].className in inSession) {
//                     console.log("classname ended = ", data[i].className)
//                     inSession.remove(data[i].className)
//                     recordAttendance(className)
//                 }
//             }
//         }
//         console.log(inSession)
//     })
// }, 900000) // Runs every 15 minutes


module.exports = router