import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
// import { Icon } from '@mui/material'
import React, { useState} from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';

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
            <MenuItem
                component={<Link to='/TimeStampList'/>}
                icon={<TrendingUpIcon fontSize='small'/>}
            > Trends </MenuItem>
            <SubMenu
                label="Manage Classes"
                icon={<ManageHistoryIcon fonSize='small'/>}
            >
                <MenuItem> Student Attendance </MenuItem>
                <MenuItem> Class Roster </MenuItem>
                <MenuItem> Change Classes </MenuItem>
            </SubMenu>
            <MenuItem
                icon={<PersonIcon fontSize='small'/>}
            > Account </MenuItem>
        </Menu>
    </Sidebar>
    )
}