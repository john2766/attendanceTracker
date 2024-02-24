import { Link } from 'react-router-dom'
import { MenuItem } from 'react-pro-sidebar'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import axios from 'axios'
import { useEffect, useState } from 'react'

export function Classes() {
    const [classes, setClasses] = useState(null)
    useEffect(() => {
        var instructor = "iAmInstructor" //"Milind Kulkarni" // temporary 
        var params = {
            instructor: instructor
        }
        axios("/classes", { params })
            .then(response => {
                console.log(response.data[0])
                setClasses(response.data.map((entry) => ({
                    className: entry.className
                })));
            })
            .catch(error => {
                console.log("Error retriving classes: ", error)
            })
    }, [])

    console.log("Classes = ", classes)
    var component = []

    for (var i in classes) {
        console.log('this class = ', classes[i].className)
        component = component.concat(
            <MenuItem
                key={i}
                component={<Link to={'/Class/' + classes[i].className} />}
                icon={<ClassOutlinedIcon fontSize='small'/>}
            > {classes[i].className} </MenuItem>
        )
    }
    return (component)
}
