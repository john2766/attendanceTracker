import axios from 'axios'
import { Card, Dialog } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { MuiFileInput } from 'mui-file-input'
import Papa from 'papaparse'

export function Class () {
    const [rows, setRows] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState()
    const [id, setId] = useState()
    const [newVal, setNewVal] = useState()
    const [oldVal, setOldVal] = useState()
    const [isData, setIsData] = useState(true)
    const [file, setFile] = useState(null)

    let {className} = useParams()

    // Class roster (and overall attendance) table layout
    const columns = [
        { field: 'nameFirst', headerName: 'First Name', width: 150 },
        { field: 'nameLast', headerName: 'Last Name', width: 150 },
        { field: 'attendances', headerName: 'Total Attendances', width: 150, editable: true, preProcessEditCellProps},
        { field: 'delete', headerName: 'Delete Student', width: 150, renderCell: deleteButton},
    ]

    function deleteButton () {
        return <button> Delete student </button>
    }

    // Populate class roster table
    useEffect(() => {
        console.log("here")
        var params = { className: className }
        console.log("query with className = ", className)
        axios('/roster', { params })
            .then(response => {
                console.log(response.data)
                setRows(response.data.map((entry) => ({
                    id: entry.id,
                    nameFirst: entry.nameFirst,
                    nameLast: entry.nameLast,
                    attendances: entry.attendances,
                })))
                if (response.data.length === 0) setIsData(0)
                else setIsData(1)
            })
            .catch(error => {
                console.log("Error getting roster: ", error)
            })
    }, [className, isOpen])

    // Sets values for processing when instructor manually edits attendance data
    function preProcessEditCellProps(params) {
        setIsOpen(true)
        setName(params.row.nameFirst + " " + params.row.nameLast)
        setOldVal(params.row.attendances)
        setNewVal(params.props.value)
        setId(params.row.id)
    }

    // Sends request to update database with new student attendance
    function handleAttendanceChange() {
        console.log("change to newVal = ", newVal)
        var params = {
            newVal: newVal,
            id: id,
            className: className
        }
        axios("/update_attendance", { params })
        setIsOpen(false)
    }

    // Class Roster Table
    function ClassRoster () {
        return (
        <div>
            <div>{!rows ? "Loading..." :
                        <DataGrid
                        height="700px"
                        rows={rows}
                        columns={columns}
                        />
                    }
            </div>
            <div> *Double click on field to edit attendances </div>
                <Dialog onClose={() => setIsOpen(false)} open={isOpen}>
                    <Card
                    sx={{ width: 3/4, margin: 1.5, justifyContent: "center"}}
                    variant='plain'
                    >
                        <div> You are changing {name}'s attendances from {oldVal} to {newVal}. </div>
                        <div> Are you sure you want to do this? </div><br/>
                        <button onClick={() => handleAttendanceChange()}> Yes </button>
                        <span> &nbsp; </span>
                        <button onClick={() => setIsOpen(false)}> Cancel </button>
                    </Card>
                </Dialog>
            </div>
        )
    }

    // Component to upload a new class roster
    function UploadRoster() {

        return (
            <Card
            sx={{ width: 3/4, margin:2 }}
            variant='plain'
            >
                <h3> Welcome to the class page for {className}! </h3>
                <div> To get started, upload your class roster below </div><br/>
                <MuiFileInput placeholder="Click here to upload a file" value={file} inputProps={{ accept: '.csv'}} onChange={(e) => setFile(e)}/><br/>
                <br/><button onClick={() => setFile(null)}> Clear file </button>
                <button onClick={() => handleUploadRoster()}>Upload roster</button>
            </Card>
        )
    }

    // Read the uploaded file and send to server
    function handleUploadRoster() {
        Papa.parse(file, {
            complete: (result) => {
                var params = {
                    roster: result.data,
                    className: className
                }

                axios("/upload_roster", { params })
            console.log("setting roster to ", result.data)
            },
            header: true
        });
    }

    return (
        <Card sx={{width: 1}} variant='plain'>

        {isData ?
            <Card
            sx={{ width: 3/4, margin:2 }}
            variant='plain'
            >
                <h3> {className} </h3>
                <div> This is the class page- one for each class </div>
                <div> - TODO: place to upload new roster</div>
                <div> - TODO: lookup/change past attendance data</div>
                <div> - TODO: add ability to delete class </div>
                <h3> Class Roster </h3>
                <ClassRoster/>
            </Card>
        : <UploadRoster/>
        }
        </Card>
    )
}