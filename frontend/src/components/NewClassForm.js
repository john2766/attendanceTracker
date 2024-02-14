import { Card, Button, Stack } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { useState } from 'react'
import axios from 'axios'

export function NewClassForm() {
    const [className, setClassName] = useState()
    const [classroom, setClassroom] = useState()
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    const [days, setDays] = useState([])

    function handleFormSubmission() {
        const params = {
            username: 'iAmInstructor',
            className: className,
            classroom: classroom,
            startTime: startTime,
            endTime: endTime,
            days: days
        }
        axios("/create_class", { params })
        console.log('submitting info: ', className)
    }

    function handleDayInputs(day) {
        // If days is empty, set days to day
        if(days.length === 0) setDays([day])

        // Else add/remove day from days
        else {
            // If day already in days remove it, else add it
            if (days.indexOf(day) > -1) setDays(days.filter(d => d !== day))
            else setDays(days.concat(day))
        }
    }


    // Adds list of days to select
    function Days() {
        var dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        var component = []
        for (var i in dayList) {
            component = component.concat(
                <div>
                    <Checkbox
                        id={dayList[i]}
                        name={dayList[i]}
                        checked={days.includes(dayList[i])}
                        onChange={event => {handleDayInputs(event.target.name)}}
                    />
                    <label> {dayList[i]} </label>
                </div>
            )
        }
        return component
    }

    return (
        <Card
            sx={{ width: 3/4, margin: 2}}
            variant='plain'
        >
            <h2> New Class Form </h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <label> Class name: </label><br/>
                <TextField
                    type='text'
                    id='className'
                    name='className'
                    size='small'
                    onChange={event => {setClassName(event.target.value)}}
                /><br/><br/><br/>
                {/* Ideally make classroom a dropdown of all classrooms in the system */}
                <label> Classroom building/room number: </label><br/>
                <TextField
                    type='text'
                    id='classroom'
                    size='small'
                    onChange={event => {setClassroom(event.target.value)}}
                /><br/><br/>
                <Stack direction="row" spacing={5} style={{ paddingBottom: 30, paddingTop: 20}}>
                    <Card variant='plain' sx={{ flexDirection: 'row' }}>
                        <div> Class start time: </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                // label='Start Time'
                                onChange={(newTime)=> {setStartTime(newTime); console.log(newTime)}}
                                // value={startTime? startTime : }
                                />
                        </LocalizationProvider>
                    </Card>
                    <Card variant='plain'>
                        <div>Class end time:</div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                onChange={(newTime)=> {setEndTime(newTime); console.log(newTime)}}
                                />
                        </LocalizationProvider>
                    </Card>
                </Stack>
                <label> Select days for the class: </label>
                <Days/>
                <br/><br/>
                <Button key='button' variant='outlined' color='primary' background='primary' type='submit' onClick={(e) => (handleFormSubmission())}> Submit </Button>
            </form>
            {/* {startTime? startTime: "startime"} */}
        </Card>
    )
}