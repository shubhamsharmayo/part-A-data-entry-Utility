import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/Signup'
import CreateTemplate from './pages/createtemplate/CreateTemplate'
import Imagescanner from './pages/createtemplate/Imagescanner'
import EditTemplate from './pages/edittemplate/EditTemplate'
import { userData } from './context/userData'
import Navbar from './components/Navbar/Navbar'
import Csvuploader from './pages/csvUploader/Csvuploader'
import TemplateMapping from './pages/templateMapping/TemplateMapping'
    // sj
import DuplicateDetector from './pages/duplicateDetector/DuplicateDetector'
    // {/* sj */}
import TaskManager from './pages/TaskManager/TaskManager'
import AdminAssigned from './pages/dataMatching/Adminassigned'
import UserTaskAssined from './pages/operator/UserTaskAssined'
import DataMapping from './pages/operator/DataMapping'
import PageNotFound from './components/PageNotFound'

function App() {

  const { userDetail, setUser } = userData()
  console.log(userDetail)
  const role = userDetail?.user?.role
  const permissions = userDetail?.user?.permissions

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userdata')))
  }, [])


  return (

    <BrowserRouter>
      {userDetail && <Navbar />}
      <Routes>
        {!userDetail&&(
          <>
          <Route path='/' element={<Login />} />
           <Route
              path="*"
              element={
                <PageNotFound
                 
                />
              }
            />
          </>
        )}
        
        {role === "Admin" && (
          <>

            <Route path='/signup' element={<SignUp />} />
           
          </>
        )}
        {(role === "Admin" || role === "Operator") && permissions.createTemplate && (
          <>
            <Route path='/createtemplate' element={<CreateTemplate />} />
            <Route path='/imagemapping' element={<Imagescanner />} />
            <Route path='/edittemplate/:id' element={<EditTemplate />} />
          </>
        )}
        {(role === "Admin" || role === "Operator") && permissions.csvuploader && (
          <>
            <Route path='/csvuploader' element={<Csvuploader />} />
                    {/* sj */}
            <Route path="/csvuploader/duplicatedetector/:id" element={<DuplicateDetector />} />
                {/* sj */}
            {/* <Route path='/imagemapping' element={<Imagescanner />} /> */}
            <Route path="/csvuploader/templatemapping/:id" element={<TemplateMapping />} />
            <Route path='/csvuploader/assigntask/:id' element={<TaskManager />} />
          </>
        )}
        {(role === "Admin" || role === "Operator") && permissions.dataEntry && (
          <>
            <Route path='/datamatching' element={role !== "Admin" ? <UserTaskAssined /> : <AdminAssigned />} />
            <Route path="/datamatching/:id" element={<DataMapping />} />
          </>
        )}


      </Routes>

    </BrowserRouter>


  )
}

export default App
