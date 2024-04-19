//import React, {useState, useRef, useEffect} from 'react';
import { LiveClass } from './components/LiveClass'
import { SideBar } from './components/Sidebar'
import { Class } from './components/Class'
import { NewClassForm } from './components/NewClassForm'
import { Account } from './components/Account'
import { Login } from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PageNotFound } from './components/PageNotFound'
import { Outlet } from 'react-router-dom'


function App() {

  const SidebarLayout = () => (
    <>
      <SideBar />
      <Outlet />
    </>
  )

  return (
      <Router>
        <div style={{display: 'flex'}}>
          <Routes>
            <Route element={<SidebarLayout/>}>
              <Route path='/' element={<LiveClass/>} />
              <Route path='/newclassform' element={<NewClassForm/>} />
              <Route path='/Class/:className' element={<Class/>} />
              <Route path='/Account' element={<Account/>} />
            </Route>
            <Route path='/Login' element={<Login/>} />
            <Route path='*' element={<PageNotFound/>} />
          </Routes>
        </div>
      </Router>

  )
}

export default App;