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
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState()
    const [id, setId] = useState()
    const [newVal, setNewVal] = useState()
    const [oldVal, setOldVal] = useState()
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
        { field: 'attendances', headerName: 'Total Attendances', width: 150, editable: true, preProcessEditCellProps},
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
        console.log(params)
        axios('/student_delete', { params })
        setDeleteOpen(null)
        setRefresh(!refresh)
    }

    // Populate class roster table
    useEffect(() => {
        var params = { className: className }
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

    }, [className, refresh])

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
        axios.post("/update_attendance", params)
        setIsOpen(false)
        setRefresh(!refresh)
    }

    // Get a list of all students in the system but not in the class (for dropdown)
    useEffect(() => {
        var params = { className: className }
        axios("/all_students", { params })
        .then(response => {
            console.log(response.data)
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
        console.log("student = ", student)
        var params = {
            id: student.id,
            className: className
         }
        axios.post("/student_add", params)
        setIsAddStudent(false)
        setRefresh(!refresh)
        setStudent(null)
    }

    // Delete class from database
    function handleDeleteClass() {
        console.log("DELETING CLASS ")
        var params = { className: className }
        axios.post("/class_delete", params)
        setDeleteOpen(false)
        navigate('/')
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
        </div>
        )
    }

    // Get important information about the class
    useEffect(() => {
        var params = { className: className }
        axios('/class_info', { params })
        .then (response => {
            console.log("classinfo = ", response.data[0])

            // if no class data, class does not exist
            if (!response.data[0]) {
                navigate('/PageNotFound')
                return
            }
            // Parse days back into list
            setDays(response.data[0].days.split(','))

            // Parse time
            var start = new Date(response.data[0].startTime)
            var end = new Date(response.data[0].endTime)
            start = start.toLocaleTimeString('en-US')
            end = end.toLocaleTimeString('en-US')
            setTime(start + " - " + end)

            setInstructor(response.data[0].username)
            setLocation(response.data[0].classroom)
            console.log(location)

        })
    },[className, location, navigate])

    // Display important information about the class
    function ClassInfo() {
        console.log(days.length)
        const listDays = days.map((day, index) => day !== '' &&
            <span key={index}> {day}
            </span>)
        return (<Card>
            <h2> {className} </h2>
            <p> <b>Meeting days:</b> {listDays} &emsp;&emsp; <b>Meeting time:</b> {time} &emsp;&emsp; <b>Location:</b> {location} &emsp;&emsp; <b>Instructor:</b> {instructor} </p>
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
                axios("/upload_roster", { params })
            },
            header: true
        });
        setRefresh(!refresh)
    }

    return (
        <Card sx={{width: 1}} variant='plain'>

        {isData ?
            <Card
            sx={{ width: 9/10, margin:2 }}
            variant='plain'
            >
                <ClassInfo/><br/>
                <div> This is the class page- one for each class </div>
                <div> - TODO: lookup (but not change) past attendance data</div>
                <h3> Class Roster </h3>
                <ClassRoster/>
            </Card>
        : <UploadRoster/>
        }
        <Card
            variant='plain'
        >
            <br/><button onClick={() => setIsAddStudent(!isAddStudent)}> Add student to class </button>
                <button onClick={() => setIsDeleteClass(true)}> Delete {className} </button>
                {isAddStudent ? <AddStudent/> : <br/>}
                    {/* Confirmation to change students's attendance: */}
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