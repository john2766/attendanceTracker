const db = require('../models/db')
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// record attendance for each student after a class has ended (present if there for more than 80% of class)
function recordAttendance(className) {
    var percentage = 0.8
    db.all('SELECT classroom, startTime, endTime FROM classData WHERE className = ?', className, (err, data) => {
        if (err) {
            console.log("error getting classroom: ", err.message)
        }
        else {
            console.log(data)
            const classroom = data[0].classroom
            const startTime = new Date(data[0].startTime)
            const endTime = new Date(data[0].endTime)
            const startSec = toSeconds(startTime.toTimeString().split(' ')[0])
            const endSec = toSeconds(endTime.toTimeString().split(' ')[0])
            query = `SELECT * FROM ${classroom} WHERE time(timeOut) > ${startTime.getTime()}`
            db.all(query, (err, data) => {
                if (err) {
                    console.error("error getting attendance data: ", err.message)
                    return
                }
                else {
                    console.log("this data = ", data)
                    var attendance = {}
                    for (var i in data) {
                        var id = data[i].id
                        console.log('id = ', id)
                        // Add up total time student has been in room during class

                        var startTime = toSeconds(data[i].timeIn)
                        if (startTime < startSec) startTime = startSec

                        var endTime = toSeconds(data[i].timeOut)
                        if (endTime > endSec) endTime = endSec

                        var currTime = 0
                        if (id in attendance) currTime = attendance[id]
                        attendance[id] = currTime + endTime - startTime

                    }
                    console.log("attendance = ", attendance)
                    var currDay = weekDays[new Date().getDay()]

                    var minTime = percentage * (endSec - startSec)
                    for (var id in attendance) {
                        var attended = + (attendance[id] >= minTime)
                        db.all(`UPDATE attendance SET ${currDay} = ${attended} WHERE id = ${id} AND className = "${className}"`, (err, data) => {
                            if (err){
                                console.log(err)
                            }
                        })
                        db.all(`UPDATE attendance SET attendances = attendances + 1 WHERE id = ${id} AND className = "${className}"`, (err, data) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                }
            })
        }

    })
    return
}

// Change HH:MM:SS to seconds
function toSeconds(timeString) {
    var times = timeString.split(':')
    var seconds = parseInt(times[2]) + 60 * parseInt(times[1]) + 3600 * parseInt(times[0])
    return seconds
}

// Logging attendance data
function checkClasses() {
    let inSession = []
    setInterval(function() {
        // Check if there is a live class for all instructors
        db.all('SELECT * FROM classData', (err, data) => {
            if (err) {
                console.error(err.message)
            }
            else {
                console.log(data)
                for (i in data){
                    // If current time is greater than class start time and current time is less than class end time
                    if (new Date((data[i].startTime)).toTimeString() < new Date().toTimeString() &
                        new Date((data[i].endTime)).toTimeString() > new Date().toTimeString()){
                        // And if it is the correct day of the week
                        currDay = weekDays[new Date().getDay()]
                        if (data[i].days.includes(currDay)) {
                            // Class in session, push if not already recorded as in session
                            if (!(data[i].className in inSession)) {
                                inSession[data[i].className] = data[i].classroom
                            }
                        }
                    }
                    // if class has ended
                    else if (data[i].className in inSession) {
                        console.log("classname ended = ", data[i].className)
                        inSession.remove(data[i].className)
                        recordAttendance(className)
                    }
                }
            }
            console.log(inSession)
        })
    }, 900000) // Runs every 15 minutes
}

checkClasses() // Run function when classServices.js is required