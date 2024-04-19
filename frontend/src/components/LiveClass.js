import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid';
import { Card } from '@mui/material'
import { useNavigate } from 'react-router-dom'

axios.defaults.baseURL = "http://localhost:3001"

export function LiveClass() {
    const [rows, setRows] = useState([])
    const [rows2, setRows2] = useState([])
    const [isData, setIsData] = useState()
    const [isAbsentData, setIsAbsentData] = useState()
    const [liveClass, setLiveClass] = useState(null)

    const navigate = useNavigate()

    const columns = [
        { field: 'nameFirst', headerName: 'First Name', width: 150 },
        { field: 'nameLast', headerName: 'Last Name', width: 150 },
        { field: 'status', headerName: 'Status', width: 150}
    ]

    function NoLiveClass() {
        return (
            <Card variant='plain' align='center'> No classes are currently live. </Card>
        )
    }

    useEffect(() => {
        var token = localStorage.getItem("token")
        if (!token) navigate('/login')
        axios("/check_live", { headers: {'Authorization' : token} })
            .then(response => {
                if(response.data.length === 0) {
                    setLiveClass(null)
                }
                else {
                    setLiveClass(response.data)
                }
            })
            .catch(error => {
                console.log("error checking live: ", error)
                navigate('/account')
                return
            })
    })

    useEffect(() => {
        if (liveClass !== null) {
            var params = { class: liveClass }
            var token = localStorage.getItem("token")
            if (!token) navigate('/login')
            axios("/live_class_roster_present", { headers: {'Authorization' : token}, params: params })
                .then(response => {
                    if(response.data.length === 0) {
                        setIsData(0)
                    }
                    else {
                        setIsData(1)
                        setRows(response.data.map((entry) => ({
                            id: entry.id,
                            nameFirst: entry.nameFirst,
                            nameLast: entry.nameLast,
                            status: 'Present',
                        })));
                    }
                })
                .catch(error => {
                    console.log("Error retrieving live class", error)
                    navigate('/account')
                    return
                })

            axios("/live_class_roster_absent", { headers: {'Authorization' : token}, params: params })
                .then(response => {
                    if(response.data.length === 0) {
                        setIsAbsentData(0)
                    }
                    else {
                        setIsAbsentData(1)
                        setRows2(response.data.map((entry) => ({
                            id: entry.id,
                            nameFirst: entry.nameFirst,
                            nameLast: entry.nameLast,
                            status: 'Absent',
                        })));
                    }
                })
                .catch(error => {
                    console.log("Error retrieving absent students", error)
                    navigate('/account')
                    return
                })
        }
        else console.log("no class in session")
        // Display time of next class (ideally) if class not in session
    }, [liveClass, navigate])

    return (
        <Card
            sx={{ width: 3/4, margin: 2 }}
            variant='plain'
        >
            <h2> Live Class Data{liveClass ? ": " + liveClass : '' }</h2>
                <div>{!rows ?
                    !liveClass ? <NoLiveClass/> : "Loading..." :
                    !isData ? "No students currently in class" :
                    <>
                    <DataGrid
                    height="700px"
                    rows={rows}
                    columns={columns}
                    hideFooter={true}
                    rowHeight={25}
                    columnHeaderHeight={30}
                    />
                    <br/>
                    </>
                }</div>

                <div>{!rows ?
                    !liveClass ? "" : "Loading..." :
                    !isAbsentData ? "No students currently absent" :
                    <DataGrid
                    height="700px"
                    rows={rows2}
                    columns={columns}
                    hideFooter={true}
                    rowHeight={25}
                    columnHeaderHeight={30}
                    getRowClassName={(params) => `row-theme--${params.row.status}`}
                    />
                }</div>
        </Card>
    )
}