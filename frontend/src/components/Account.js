// Authentication based on this website:
// https://www.bezkoder.com/react-express-authentication-jwt/

import { useState } from 'react'
import axios from 'axios'
import { Card } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'


export function Account () {
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    function handleSignup() {
        const params = {
            username : user,
            password : password
        }
        axios.post('/signup', params)
        setPassword(null)
    }

    function handleLogin() {
        if (user == null || password == null) {
            alert("Please enter both a username and password")
            return
        }
        const params = {
            username: user,
            password: password
        }
        axios.post('/login', params)
            .then(response => {
                localStorage.setItem('token', response.data.token)
                console.log(response)
            })
        setPassword(null)
    }

    function handleLogout() {
        console.log("handlelogout")
        localStorage.removeItem("token")
        navigate('/Login')
    }

    var token = localStorage.getItem("token")

    return (
        <Card
        sx={{ width: 3/4, margin: 2 }}
        variant='plain'
        >
            <h2> Account </h2>
            <div>
                TODO: <br/>
                - profile page (username, log out button) <br/>
                - Protected routes (w/ redirect to login)
                - Hide password
            </div><br/>
            <button type='submit' onClick={() => handleLogout()}> Logout </button>
            <br/><br/>{token}
        </Card>
    )
}