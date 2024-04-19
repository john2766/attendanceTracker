// function to verify that instructor attempting to access class data
// is the instructor who initially created the class
const db = require('../models/db')

function authorize(username, className, callback) {
    db.all('SELECT username FROM classData WHERE className = ?', className, (err, data) => {
        if (err) {
            console.log(err.message)
            callback(false)
        }
        else {
            if (data && data[0] && data[0].username == username) callback(true)
            else callback(false)
        }
    })
}

module.exports = authorize