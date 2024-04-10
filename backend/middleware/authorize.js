// function to verify that instructor attempting to access class data
// is the instructor who initially created the class
const db = require('../models/db')

function authorize(username, className, callback) {
    db.all('SELECT username FROM classData WHERE className = ?', className, (err, data) => {
        if (err) {
            console.log(err.message)
            console.log("false in if")
            callback(false)
        }
        else {
            console.log("data = ", data)
            if (data && data[0] && data[0].username == username) {
                console.log("true in else")
                callback(true)
            }
            else {
                console.log("false in else")
                callback(false)
            }
        }
    })
    console.log("not supposed to be here")
}

module.exports = authorize