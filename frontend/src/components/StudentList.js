/*
List all users stored in their database (would be relevant for admin access)
This will not be used for instructors
*/

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid';
import { Card } from '@mui/material'

axios.defaults.baseURL = "http://localhost:3001"

// User list table
const columns = [
    { field: 'NameFirst', headerName: 'First Name', width: 150 },
    { field: 'NameLast', headerName: 'Last Name', width: 180 },
    { field: 'ID', headerName: 'ID', width: 150 }
]

// To populate rows of User table
export function StudentList() {
    const[rows, setRows] = useState(null)
    const[isData, setIsData] = useState(1)
    useEffect(() => {
        axios("/users_list")
            .then(response => {
                if(response.data.length === 0) {
                    setIsData(0)
                }
                else {
                    console.log("Listing users")
                    setIsData(1)
                    setRows(response.data.map((entry) => ({
                        id: entry.ID,                           //DataGrid requires unique id for each row
                        NameFirst: entry.NameFirst,
                        NameLast: entry.NameLast,
                        ID: entry.ID
                    })));
                }
                })
            .catch(error => {
                console.log("Error retriving users")
            })
    }, [])


    return (
        <Card
            sx={{
                width: 3/4,
                margin: 2,
            }}
            variant='plain'
        >
            <div> List of all the users:</div>

            <div>{!rows ? <div>Loading...</div> :
            !isData ? "No user data available" :
                <DataGrid
                    height="700px"
                    rows={rows}
                    columns={columns}
                />
            }
            </div>
        </Card>
    );
}

export function Test() {
    const[data, setData] = useState(null);
    useEffect(() => {
        axios("/api")
            .then(response => {
                console.log(response.data.DATA)
                setData(response.data.DATA)
            })
            .catch(error => {
                console.error("error from server: ", error);
            });
    }, []);

    return (
        <div> {data} </div>
    );
}