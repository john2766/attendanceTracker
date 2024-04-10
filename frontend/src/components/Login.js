import { useState } from 'react'
import axios from 'axios'
import { Card } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'


export function Login () {
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const [isLogin, setIsLogin] = useState(true)
    const navigate = useNavigate()

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
                navigate('/')
            })
        setPassword(null)
    }

    function handleSignup() {
        const params = {
            username : user,
            password : password
        }
        axios.post('/signup', params)
        setIsLogin(true)
    }

    return (
        <div style={{ width: '30%', margin: 'auto'}}>
            {isLogin ?
        <Card
        sx={{ margin: 'auto', padding: 3}}
        >
            <h2> Login </h2>
            <button type='submit' onClick={() => setIsLogin(false)}> Don't have an account? Sign up here. </button><br/><br/>

            <form onSubmit={(e) => e.preventDefault()}>
                <label> Enter username: </label><br/>
                <TextField
                    type='text'
                    id='username'
                    name='username'
                    onChange={event => {setUser(event.target.value)}}
                /><br/>
                <label> Enter password: </label><br/>
                <TextField
                    id='password'
                    name='password'
                    onChange={event => {setPassword(event.target.value)}}
                />
            </form><br/>
            <button type='submit' onClick={handleLogin}> Login </button>
        </Card> :
        <Card
        sx={{ margin: 'auto', padding: 3}}
        >
            <h2> Sign up </h2>
            <button onClick={() => setIsLogin(true)}> Already have an account? Login here. </button><br/><br/>

            <form onSubmit={(e) => e.preventDefault()}>
                <label> Create username: </label><br/>
                <TextField
                    type='text'
                    id='username'
                    name='username'
                    onChange={event => {setUser(event.target.value)}}
                /><br/>
                <label> Create password: </label><br/>
                <TextField
                    type='text'
                    id='password'
                    name='password'
                    onChange={event => {setPassword(event.target.value)}}
                />
            </form><br/>
            <button type='submit' onClick={() => handleSignup()}> Signup </button>
            </Card>
            }
        </div>
    )
}