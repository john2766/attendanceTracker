//import React, {useState, useRef, useEffect} from 'react';
import { UsersList } from './components/UsersList'
import { TimeStampList } from './components/TimeStampList'
import { SideBar } from './components/Sidebar'
import { NewClassForm } from './components/NewClassForm'
// import { Card } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
      <Router>

        <div style={{display: 'flex'}}>
          <SideBar/>
          <Routes>
            <Route path='/' element={<UsersList/>} />
            <Route path='/TimeStampList' element={<TimeStampList/>} />
            <Route path='/newclassform' element={<NewClassForm/>} />
          </Routes>
        </div>
      </Router>

  )
}

export default App;