import { Card } from '@mui/material'

export function PageNotFound() {
    return (
        <Card
        sx={{ width: 3/4, margin:2 }}
        variant='plain'
        >
            <h2> 404 Page not found </h2>
            Please refresh the page and try again.
        </Card>
    )
}