//import React, {useState, useRef, useEffect} from 'react';
// import { StudentList } from './components/StudentList'
//import { TimeStampList } from './components/TimeStampList'
import { LiveClass } from './components/LiveClass'
import { SideBar } from './components/Sidebar'
import { Class } from './components/Class'
import { NewClassForm } from './components/NewClassForm'
import { Account } from './components/Account'
// import { Card } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


function App() {

  return (
      <Router>
        <div style={{display: 'flex'}}>
          <SideBar/>
          <Routes>
            <Route path='/' element={<LiveClass/>} />
            <Route path='/newclassform' element={<NewClassForm/>} />
            <Route path='/Class' element={<Class/>} />
            <Route path='/Account' element={<Account/>} />
          </Routes>
        </div>
      </Router>

  )
}

export default App;