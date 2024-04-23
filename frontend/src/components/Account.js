// Authentication based on this website:
// https://www.bezkoder.com/react-express-authentication-jwt/

import { Card } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
// import ReactHtmlParser from 'react-html-parser'


export function Account () {
    const navigate = useNavigate()
    const [username, setUsername] = useState()
    const [classes, setClasses] = useState([])
    const [info, setInfo] = useState([])

    function handleLogout() {
        console.log("handlelogout")
        localStorage.removeItem("token")
        navigate('/Login')
    }

    useEffect(() => {
        var token = localStorage.getItem("token")
        axios('/account', { headers: {'Authorization' : token} })
            .then(result => {
                setUsername(result.data)
            })
            .catch(error => {
                console.log("error with account: ", error)
                navigate('/Login')
            })
    })

    useEffect(() => {
        // Get all classes for the instructor
        var token = localStorage.getItem("token")
        if (token != null) {
            axios("/classes", { headers: {'Authorization' : token} })
                .then(response => {
                    setClasses(response.data.map((entry) => ({
                        className: entry.className
                    })));
                })
                .catch(error => {
                    if (error.response.data.error === 'Invalid token') {
                        console.log("invalid token")
                        navigate('/login')
                        localStorage.removeItem('token')
                        return
                    }
                    navigate('/')
                    return
                })
        }
        else(navigate('/login'))
    },[navigate])

    useEffect(() => {
        if (classes.length === 0) return
        for (var i in classes) {
            var className = classes[i].className
            function getInfo(i, className) {
                // If class in already in information list, don't add it again
                if (info.some(elem => elem.className === className)) return
                console.log('didnt return')

                // Get class info
                var params = { className: className}
                var token = localStorage.getItem("token")
                axios('/class_info', { headers: {'Authorization' : token}, params: params })
                .then (response => {
                    // Parse days back into list
                    console.log('response data for class = ', className, response.data)
                    var dayList = response.data[0].days.split(',')
                    var days = ''
                    for (var i in dayList) {
                        if (dayList[i] !== '') {
                            days = days.concat(dayList[i] + ' ')
                        }
                    }

                    // Parse time
                    var start = new Date(response.data[0].startTime)
                    var end = new Date(response.data[0].endTime)
                    start = start.toLocaleTimeString('en-US')
                    end = end.toLocaleTimeString('en-US')
                    var time = start + " - " + end

                    // Add information to info list
                    var classInfo = ({'className': className, 'days': days, 'time': time, 'classroom': response.data[0].classroom})
                    setInfo(info => [...info, classInfo])
                })
                .catch(error => {
                    console.log("error with getting class info: ", error)
                })
            }
            getInfo(i, className)
        }

    },[classes])

    function ClassInfo() {
        var retVal = []
        console.log("info = ", info)
        for (var i in info){
            var entry = info[i]
            retVal = retVal.concat(
                <Card key={i} sx={{ width: 3/4, marginBottom: 2, padding: 2}}>
                    <b> {entry.className} </b><br/><br/>
                    Days: {entry.days} <br/>
                    Time: {entry.time} <br/>
                    Classroom: {entry.classroom}<br/>
                </Card>
            )
        }

        return (
            <Card variant='plain'>
                <b> Class Summary: </b><br/><br/>
                {retVal}
            </Card>
        )
    }

    return (
        <Card
        sx={{ width: 3/4, margin: 2 }}
        variant='plain'
        >
            <h2> Account{username ? <span>: {username} </span> : ''} </h2>
            <ClassInfo/><br/>
            <button type='submit' onClick={() => handleLogout()}> Logout </button> <br/>
        </Card>
    )
}