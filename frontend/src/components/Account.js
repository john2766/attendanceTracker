import { Card } from '@mui/material'

// Authentication based on this website:
// https://www.bezkoder.com/react-express-authentication-jwt/


export function Account () {
    return (
        <Card
        sx={{ width: 3/4, margin: 2 }}
        variant='plain'
        >
            <h2> Account </h2>
            <div>
                TODO: <br/>
                - sign up page <br/>
                - sign in page <br/>
                - profile page (username, log out button) <br/>
            </div>
        </Card>
    )
}