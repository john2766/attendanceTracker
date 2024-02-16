import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
// import { Icon } from '@mui/material'
import React, { useState} from 'react'
import { Classes } from './Classes'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
// import ManageHistoryIcon from '@mui/icons-material/ManageHistory';

export function SideBar () {
    const [isCollapsed, setIsCollapsed] = useState(false)
    return (
    <Sidebar
        collapsed = {isCollapsed}
        rootStyles={{
            [`.${sidebarClasses.container}`]: {
            backgroundColor: 'lightgrey',
            height: '700px'
            },
        }}
    >
        <Menu menuItemStyles={{
            'button': {backgroundColor: 'lightgrey'}
        }}>
            <MenuItem
                icon={<MenuIcon fontSize='small'/>}
                onClick= {() => setIsCollapsed(!isCollapsed)}
            >
            </MenuItem>
            <MenuItem
                component={<Link to='/' />}
                icon={<AccessTimeIcon fontSize='small'/>}
            > Live Classes </MenuItem>
            <Classes/>
            <MenuItem
                component={<Link to='/newclassform'/>}
                icon={<AddIcon fontSize='small'/>}
            > Add Class </MenuItem>
            <MenuItem
                icon={<PersonIcon fontSize='small'/>}
                component={<Link to="/Account"/>}
            > Account </MenuItem>
        </Menu>
    </Sidebar>
    )
}