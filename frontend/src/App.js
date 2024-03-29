//import React, {useState, useRef, useEffect} from 'react';
import { LiveClass } from './components/LiveClass'
import { SideBar } from './components/Sidebar'
import { Class } from './components/Class'
import { NewClassForm } from './components/NewClassForm'
import { Account } from './components/Account'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PageNotFound } from './components/PageNotFound'


function App() {
  // const {className} = useParams()
  return (
      <Router>
        <div style={{display: 'flex'}}>
          <SideBar/>
          <Routes>
            <Route path='/' element={<LiveClass/>} />
            <Route path='/newclassform' element={<NewClassForm/>} />
            <Route path='/Class/:className' element={<Class/>} />
            <Route path='/Account' element={<Account/>} />
            <Route path='/PageNotFound' element={<PageNotFound/>} />
          </Routes>
        </div>
      </Router>

  )
}

export default App;