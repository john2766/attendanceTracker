import { Card, Button, Stack, Autocomplete, Box } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react'
import axios from 'axios'

export function NewClassForm() {
    const [className, setClassName] = useState()
    const [classroom, setClassroom] = useState()
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    const [days, setDays] = useState([])
    const [classrooms, setClassrooms]=useState([])

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

    useEffect(() => {
        axios("/classrooms")
            .then(response => {
                console.log("response = ", response.data)
                setClassrooms(response.data)
            })
    },[])

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
            <h3> New Class Form </h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <label> Class name: </label><br/>
                <TextField
                    type='text'
                    id='className'
                    name='className'
                    sx={{ width: .3 }}
                    onChange={event => {setClassName(event.target.value)}}
                /><br/><br/><br/>
                <label> Classroom building/room number: </label><br/>
                <Autocomplete
                    id="classroom"
                    sx={{ width: .3 }}
                    options={classrooms}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          {option.name}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                          {...params}
                          inputProps={{...params.inputProps}}
                        />
                      )}
                      onChange={event => {setClassroom(event.target.value)}}
                />
                <Stack direction="row" spacing={5} style={{ paddingBottom: 30, paddingTop: 20}}>
                    <Card variant='plain' sx={{ flexDirection: 'row' }}>
                        <div> Class start time: </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker onChange={(newTime)=> {setStartTime(newTime)}}/>
                        </LocalizationProvider>
                    </Card>
                    <Card variant='plain'>
                        <div>Class end time:</div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                onChange={(newTime)=> {setEndTime(newTime)}}
                                />
                        </LocalizationProvider>
                    </Card>
                </Stack>
                <label> Select days for the class: </label>
                <Days/>
                <br/><br/>
                <Button key='button' variant='outlined' type='submit' onClick={(e) => (handleFormSubmission())}> Submit </Button>
            </form>
        </Card>
    )
}