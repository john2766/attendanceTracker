/*
List all timestamps in a specified range of time in the database
    These timestamps are specific to one classroom
If no range specified, get all entries in the last 2 days

Ideas:
- Have timein and timeout field, only create new entry if
    1) both timein and timeout fields are full for that user OR
    2) the last timein entry for that user was more than 2 hours ago
        ie A scan in resets after 2 hours (to reduce error)
        MUST notify students it resets after 2 hours in their confimation email
    **only count as present if scan in AND scan out
- OR have ID, time, isEntry (bool), and determine if isEntry by searching for ID
    in entries in last 2 hours and then seeing if that number is odd
- If no students (or very few) scan in during a specified classtime, as prof if class was cancelled
    (if so, don't count toward total student absences for that class)
- Discard timestamp data after 1 week
    Requires log of attendances to be stored elsewhere (more compactly)

Problems:
    When is a student present (what are the cutoffs for how much time spent in class)
    What if a student leaves for the bathroom and comes back 2 minutes later (must parse multiple entries)
    What if class gets out 15 minutes early, but students must be in class for 50 minutes for attendance to count?
        - Ask instructor... "is class ending?" if many students are scanning out
        - Allow instructor to adjust amount of time needed for present based on
          the specific class period (retrospectively- within 1 week of class period)

*/

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid';
import { Card } from '@mui/material'

axios.defaults.baseURL = "http://localhost:3001"

// Time stamp table layout
const columns = [
    { field: 'ID', headerName: 'ID', width: 150 },
    { field: 'TimeIn', headerName: 'Time In', width: 150 },
    { field: 'TimeOut', headerName: 'Time Out', width: 150 }
]

export function TimeStampList (startTime, endTime) {
    const [rows, setRows] = useState(null)
    const [isData, setIsData] = useState(1)
    useEffect(() => {
        axios("/time_stamp_list")
            .then(response => {
                if(response.data.length === 0) {
                    setIsData(0)
                }
                else {
                    console.log("Retriving time stamp list")
                    setIsData(1)
                    setRows(response.data.map((entry) => ({
                        id: entry.ID,
                        ID: entry.ID,
                        TimeIn: entry.timeIn,
                        TimeOut: entry.timeOut
                    })));
                }
            })
            .catch(error => {
                console.log("Error retriving time stamps")
            })
    }, [])

    return (
        <Card
            sx={{ width: 3/4, margin: 2 }}
            variant='plain'
        >
            <div> List of all timestamps for classroom 1:</div>
                <div>{!rows ? "Loading..." :
                    !isData ? "No time stamp data available for the past 7 days" :
                    <DataGrid
                    height="700px"
                    rows={rows}
                    columns={columns}
                    />
                }</div>
        </Card>
    )

}