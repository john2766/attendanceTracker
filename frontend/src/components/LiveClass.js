import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid';
import { Card } from '@mui/material'

axios.defaults.baseURL = "http://localhost:3001"

export function LiveClass() {
    const [rows, setRows] = useState(null)
    const [isData, setIsData] = useState()
    const [liveClass, setLiveClass] = useState(null)

    const columns = [
        { field: 'ID', headerName: 'ID', width: 150 },
        { field: 'TimeIn', headerName: 'Time In', width: 150 },
        { field: 'TimeOut', headerName: 'Time Out', width: 150 }
    ]

    useEffect(() => {
        console.log("check if live")
        var params = {
            username: 'iAmInstructor'
        }
        axios("/check_live", { params })
            .then(response => {
                if(response.data.length === 0) {
                    setLiveClass(null)
                }
                else {
                    console.log(response.data)
                    setLiveClass(response.data)
                }
            })
    })

    useEffect(() => {
        if (liveClass !== null) {
            var params = {
                class: liveClass
            }
            axios("/live_class_roster", { params })
                .then(response => {
                    if(response.data.length === 0) {
                        setIsData(0)
                    }
                    else {
                        console.log("Retriving live class list")
                        setIsData(1)
                        setRows(response.data.map((entry) => ({
                            id: entry.id,
                            ID: entry.id,
                            TimeIn: entry.timeIn,
                            TimeOut: entry.timeOut ? entry.timeOut : "-"
                        })));
                    }
                })
                .catch(error => {
                    console.log("Error retrieving live class", error)
                })
        }
        else console.log("no class in session")
    }, [liveClass])

    return (
        <Card
            sx={{ width: 3/4, margin: 2 }}
            variant='plain'
        >
            <div> Loading live class data:</div>
                <div>{!rows ? "Loading..." :
                    !isData ? "No students currently in class" :
                    <DataGrid
                    height="700px"
                    rows={rows}
                    columns={columns}
                    />
                }</div>
        </Card>
    )
}