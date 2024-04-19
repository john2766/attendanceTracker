// Authentication based on this website:
// https://www.bezkoder.com/react-express-authentication-jwt/

import { Card } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'


export function Account () {
    const navigate = useNavigate()
    const [username, setUsername] = useState()

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

    return (
        <Card
        sx={{ width: 3/4, margin: 2 }}
        variant='plain'
        >
            <h2> Account </h2>
            <p> User: {username ? <span> {username} </span> : ''} </p>
            
            <div>
                TODO (in order): <br/>
                - profile page (username, log out button) <br/>
                - sidebar refresh when class is deleted/new class is added <br/>
                - add more classrooms/dummy data, make login info more professional <br/>
                - hide password <br/>
                - spacing on upload roster page (of buttons) <br/>
                - button theme <br/>
                - specify roster upload format (or allow user to download template) <br/>
                - redirect to login on token expiration <br/>
            </div><br/>
            <button type='submit' onClick={() => handleLogout()}> Logout </button>
        </Card>
    )
}