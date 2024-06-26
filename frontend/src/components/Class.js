import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Card, Dialog, Box, Autocomplete, TextField } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { MuiFileInput } from 'mui-file-input'
import Papa from 'papaparse'

export function Class () {
    const [rows, setRows] = useState()
    const [rows2, setRows2] = useState()
    const [cols2, setCols2] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState()
    const [id, setId] = useState()
    const [newVal, setNewVal] = useState()
    const [isData, setIsData] = useState(true)
    const [file, setFile] = useState(null)
    const [deleteOpen, setDeleteOpen] = useState(null)
    const [isAddStudent, setIsAddStudent] = useState(false)
    const [isDeleteClass, setIsDeleteClass] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [students, setStudents] = useState([])
    const [student, setStudent] = useState()
    const [instructor, setInstructor] = useState()
    const [days, setDays] = useState([])
    const [location, setLocation] = useState()
    const [time, setTime] = useState()

    let {className} = useParams()
    const navigate = useNavigate()

    // Class roster (and overall attendance) table layout
    const columns = [
        { field: 'nameFirst', headerName: 'First Name', width: 150 },
        { field: 'nameLast', headerName: 'Last Name', width: 150 },
        { field: 'attendances', headerName: 'Total Attendances', width: 150, editable: true },
        { field: 'delete', headerName: 'Drop Student', width: 150, renderCell: deleteButton},
    ]

    // Create a delete button component to be used for each student
    function deleteButton(params) {
        return <button onClick={() => setDeleteOpen(params.row)}> Drop </button>
    }

    // Delete student from class
    function handleDeleteStudent() {
        var params = {
            id: deleteOpen.id,
            className: className
        }
        var token = localStorage.getItem("token")
        axios.post('/student_delete', params, { headers: {'Authorization' : token} })
        setDeleteOpen(null)
        setRefresh(!refresh)
    }

    // Populate class roster table and past attendance talbe
    useEffect(() => {
        var params = { className: className }
        var token = localStorage.getItem("token")
        axios('/roster', { headers: {'Authorization' : token}, params: params})
            .then(response => {
                if (response.data.length === 0) {
                    setIsData(0)
                    return
                }

                // Populate class roster table
                setRows(response.data.map((entry) => ({
                    id: entry.id,
                    nameFirst: entry.nameFirst,
                    nameLast: entry.nameLast,
                    attendances: entry.attendances,
                })))

                // Populate past attendance table
                const rows = (response.data.map((entry) => {
                    const row = {
                        id: entry.id,
                        nameFirst: entry.nameFirst,
                        nameLast: entry.nameLast,
                    }
                    console.log("before days for each")
                    days.forEach(day => {
                        if(day !== ''){
                            if (entry[day.toLowerCase()] === 0) row[day] = '-'
                            else if (entry[day.toLowerCase()] === 1) row[day] = 'Present'
                            else row[day] = 'error'
                        }
                    })
                    console.log("after days for each")
                    return row
                }))
                setRows2(rows)

                setIsData(1)
            })
            .catch(error => {
                console.log("Error getting roster: ", error)
            })

    }, [className, days, refresh])

    // Quick solution to fix column loading error
    useEffect(() => {
        async function initRefresh() {
            await new Promise(r => setTimeout(r, 100))
            console.log("here")
            setRefresh(refresh => !refresh)
        }
        initRefresh()
    },[className])


    // Prepare values for processing when instructor changes attendance data
    function processRowUpdate(newRow) {
        const updatedRow = { ...newRow, isNew: false }
        console.log("updated Row = ", updatedRow)
        setId(updatedRow.id)
        setName(updatedRow.nameFirst + " " + updatedRow.nameLast)
        setNewVal(updatedRow.attendances)
        return updatedRow
    }

    // When attendance (newVal) is changed to a valid number, open confirmation window
    useEffect(() => {
        // Check that input is a number (and not undefined)
        if(newVal && newVal !== '' && !Number.isNaN(newVal))
            setIsOpen(true)
    },[newVal])

    // Sends request to update database with new student attendance
    function handleAttendanceChange() {
        console.log("change to newVal = ", newVal)
        var params = {
            newVal: newVal,
            id: id,
            className: className
        }
        var token = localStorage.getItem("token")
        axios.post("/update_attendance", params, { headers: {'Authorization' : token} })
            .catch(error => {
                console.log("error updating attendance: ", error)
            })
        setIsOpen(false)
        setNewVal(null)
        setRefresh(!refresh)
    }

    // Get a list of all students in the system but not in the class (for dropdown)
    useEffect(() => {
        var params = { className: className }
        var token = localStorage.getItem("token")
        axios("/all_students", { headers: {'Authorization' : token}, params: params })
        .then(response => {
            setStudents(response.data)
        })
        .catch(error => {
            console.log("Error retriving students: ", error)
        })
    }, [isAddStudent, className, refresh])

    // Form to add new student to class
    function AddStudent() {
        return (
            <Dialog onClose={()=> setIsAddStudent(false)} open={true}>
                <Card
                sx={{ width: 7/8, margin: 1.5, justifyContent: "center"}}
                variant='plain'>
                    <div> Add student to class: </div><br/>
                    <div> Search using first name, last name, email, or id</div>
                    <Autocomplete
                    id="classroom"
                    sx={{ width: 1 }}
                    options={students}
                    value={student}
                    getOptionLabel={(option) => option.nameFirst + " " + option.nameLast}
                    isOptionEqualToValue={(option, value) => option.id === value.id }
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            {option.id}&emsp;{option.nameFirst}&nbsp;{option.nameLast}&emsp;{option.email}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                          {...params}
                          inputProps={{...params.inputProps}}
                        />
                      )}
                      onChange={(event, newValue) => {setStudent(newValue)}}
                />
                    <button onClick={() => handleAddStudent()}> Add student to class </button>
                    <span> &nbsp; </span>
                    <button onClick={() => setIsAddStudent(false)}> Cancel </button>
                </Card>
            </Dialog>
        )
    }

    // Add a student to class database
    function handleAddStudent() {
        console.log("adding student = ", student)
        var params = {
            id: student.id,
            className: className
         }
        var token = localStorage.getItem("token")
        axios.post("/student_add", params, { headers: {'Authorization' : token} })
        setIsAddStudent(false)
        setRefresh(!refresh)
        setStudent(null)
    }

    // Delete class from database
    function handleDeleteClass() {
        console.log("DELETING CLASS")
        var params = { className: className }
        var token = localStorage.getItem("token")
        axios.post("/class_delete", params, { headers: {'Authorization' : token} })
        setDeleteOpen(false)
        navigate('/')
        window.location.reload()

    }

    // Class Roster Table component
    function ClassRoster () {
        return (
        <div>
            <div>{!rows ? "Loading..." :
                <DataGrid
                    height="700px"
                    rows={rows}
                    columns={columns}
                    hideFooter={true}
                    rowHeight={25}
                    columnHeaderHeight={30}
                    processRowUpdate={processRowUpdate}
                    />
            }</div>
            <div> *Double click on field to edit attendances </div>
        </div>
        )
    }

    // Past Attendance Table component
    function PastAttendance() {
        for (var row in rows2){
            console.log(rows2[row])
        }
        return (
        <div>
            <div>{!rows2 ? "Loading..." :
                <DataGrid
                    height="700px"
                    rows={rows2}
                    columns={cols2}
                    hideFooter={true}
                    rowHeight={25}
                    columnHeaderHeight={30}
                    columnBufferPx={100}
                />
            }</div>
        </div>
        )
    }

    // Get important information about the class
    useEffect(() => {
        var params = { className: className }
        var token = localStorage.getItem("token")
        axios('/class_info', { headers: {'Authorization' : token}, params: params })
        .then (response => {
            // if no class data, class does not exist
            if (!response.data[0]) {
                navigate('/PageNotFound')
                return
            }
            // Parse days back into list
            const dayList = response.data[0].days.split(',')
            setDays(dayList)

            // Get columns for attendance data table
            var attendanceCols = [
                { field: 'nameFirst', headerName: 'First Name', width: 150 },
                { field: 'nameLast', headerName: 'Last Name', width: 150 },
            ]
            for (var i in dayList) {
                if (dayList[i] !== '')
                    attendanceCols.push({ field: dayList[i], headerName: dayList[i], width: 100 })
            }
            setCols2(attendanceCols)

            // Parse time
            var start = new Date(response.data[0].startTime)
            var end = new Date(response.data[0].endTime)
            start = start.toLocaleTimeString('en-US')
            end = end.toLocaleTimeString('en-US')
            setTime(start + " - " + end)

            setInstructor(response.data[0].username)
            setLocation(response.data[0].classroom)

        })
    },[className, location, navigate])

    // Display important information about the class
    function ClassInfo() {
        const listDays = days.map((day, index) => day !== '' &&
            <span key={index}> {day}
            </span>)
        return (<Card>
            <h2> {className} </h2>
            <p> <b>Meeting days:</b> {listDays} &emsp;&emsp; <b>Meeting time:</b> {time} &emsp;&emsp; <b>Location:</b> {location} </p>
        </Card>)
    }

    // Component to upload a new class roster
    function UploadRoster() {
        return (
            <Card
            sx={{ width: 3/4, margin:2 }}
            variant='plain'
            >
                <h2> Welcome to the class page for {className}! </h2>
                <div> To get started, upload your class roster below </div><br/>
                <MuiFileInput placeholder="Click here to upload a file" value={file} inputProps={{ accept: '.csv'}} onChange={(e) => setFile(e)}/><br/>
                <br/><button onClick={() => setFile(null)}> Clear file </button>
                <button onClick={() => handleUploadRoster()}>Upload roster</button>
            </Card>
        )
    }

    // Read the uploaded file and send to server
    function handleUploadRoster() {
        if (file == null){
            alert("Please provide a file to upload")
            return
        }
        Papa.parse(file, {
            complete: (result) => {
                var params = {
                    roster: result.data,
                    className: className
                }
                var token = localStorage.getItem("token")
                axios.post("/upload_roster", params, { headers: {'Authorization' : token} })
                    .then (response => {
                        setRefresh(!refresh)
                    })
            },
            header: true
        })
    }

    return (
        <Card sx={{width: 1}} variant='plain'>

        {isData ?
            <Card
            sx={{ width: 9/10, margin:2 }}
            variant='plain'
            >
                <ClassInfo/><br/>
                <h3> Class Roster </h3>
                <ClassRoster/><br/><br/>
                <h3> Attendance This Week </h3>
                <PastAttendance/>
            </Card>
        : <UploadRoster/>
        }
        <Card
            sx={{ width: 9/10, margin:2 }}
            variant='plain'
        >
            <br/><button onClick={() => setIsAddStudent(!isAddStudent)}> Add student to class </button>
                <button onClick={() => setIsDeleteClass(true)}> Delete {className} </button>
                {isAddStudent ? <AddStudent/> : <br/>}
                    <Dialog onClose={() => setIsOpen(false)} open={isOpen}>
                        <Card
                        sx={{ width: 3/4, margin: 1.5, justifyContent: "center"}}
                        variant='plain'
                        >
                            <div> You are changing {name}'s attendances to {newVal}. </div>
                            <div> Are you sure you want to do this? </div><br/>
                            <button onClick={() => handleAttendanceChange()}> Yes </button>
                            <span> &nbsp; </span>
                            <button onClick={() => setIsOpen(false)}> Cancel </button>
                        </Card>
                    </Dialog>
                    {/* Confirmation to remove student from class: */}
                    <Dialog onClose={() => {setDeleteOpen(null); setRefresh(!refresh)}} open={(deleteOpen !== null)}>
                        <Card
                        sx={{ width: 3/4, margin: 1.5, justifyContent: "center"}}
                        variant='plain'
                        >
                            <div> Are you sure you want to remove {deleteOpen ? deleteOpen.nameFirst + " " + deleteOpen.nameLast : 'this student'} from the class? This action will delete
                                all of their attendance data.</div><br/>
                            <button onClick={() => handleDeleteStudent(deleteOpen)}> Yes </button>
                            <span> &nbsp; </span>
                            <button onClick={() => {setDeleteOpen(null); setRefresh(!refresh)}}> Cancel </button>
                        </Card>
                    </Dialog>
                    {/* Confirmation to delete entire class */}
                    <Dialog onClose={() => {setIsDeleteClass(false); setRefresh(!refresh)}} open={isDeleteClass}>
                        <Card
                        sx={{ width: 3/4, margin: 1.5, justifyContent: "center"}}
                        variant='plain'
                        >
                            <div> Are you sure you want to delete {className}?. </div>
                            <div> This will delete all student attendance data and class information. </div>
                            <div> NOTE: This action is NOT reversable!</div><br/>
                            <button onClick={() => handleDeleteClass()}> DELETE {className} </button>
                            <span> &nbsp; </span>
                            <button onClick={() => {setIsDeleteClass(false); setRefresh(!refresh)}}> Cancel </button>
                        </Card>
                    </Dialog>
                </Card>
        </Card>

    )
}