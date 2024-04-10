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
// import { Sidebar } from 'react-pro-sidebar'


function App() {
  // const navigate = useNavigate()

  const SidebarLayout = () => (
    <>
      <SideBar />
      <Outlet />
    </>
  )

  // function handleLogout() {
  //   console.log("handlelogout")
  //   localStorage.removeItem("token")
  //   // navigate('/login')
  // }

  return (
      <Router>
        <div style={{display: 'flex'}}>
          <Routes>
            <Route element={<SidebarLayout/>}>
              <Route path='/' element={<LiveClass/>} />
              <Route path='/newclassform' element={<NewClassForm/>} />
              <Route path='/Class/:className' element={<Class/>} />
              <Route path='/Account' element={<Account/>} />
              <Route path='*' element={<PageNotFound/>} />
            </Route>
            <Route path='/Login' element={<Login/>} />
          </Routes>
          {/* <button style={{height: 30}}onClick={handleLogout()}> Logout </button> */}
        </div>
      </Router>

  )
}

export default App;