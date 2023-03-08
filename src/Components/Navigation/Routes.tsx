import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Analytics } from '../../Screens/Analytics'
import { Dashboard } from '../../Screens/Fragments/Dashboard'
import NavBar from './nav/NavBar'
import './Header.css'

interface Car {
  name: number;
  code: number;
}
const BaseRouter = () => {

  const [tracks,setTracks] = React.useState(false);
  const [msg,setMsg] = React.useState(false);
  const [monitoring,setMonitoring] = React.useState(true);
  const [notifications,setNotifications] = React.useState(false)
  const[openDataWindow ,setOpenDataWindow]= React.useState(true)

  React.useEffect(()=>{
      console.log(openDataWindow)
  },[openDataWindow])
  
  // pull the dataset here
  return (
    <>
      <NavBar  
            setTracks={setTracks} 
            setMsg={setMsg} 
            setMonitoring={setMonitoring}
            setNotifications={setNotifications}
            setOpenDataWindow={setOpenDataWindow}
      />
      <div>
        <Routes>
          <Route path='/monitoring' element={
              <Dashboard 
                tracks={tracks} 
                msg={msg} 
                monitoring={monitoring}
                notifications = {notifications}
                openDataWindow = {openDataWindow}
              /> } />
           <Route path='/notifications' element={
              <Dashboard 
                tracks={tracks} 
                msg={msg} 
                monitoring={monitoring}
                notifications = {notifications}
                openDataWindow = {openDataWindow}
              /> } 
            />
            <Route path='/analytics' element={<Analytics /> } />

            <Route path='/tracks' element={
              <Dashboard 
                tracks={tracks} 
                msg={msg} 
                monitoring={monitoring}
                notifications = {notifications}
                openDataWindow = {openDataWindow}
              /> } 
            />
            <Route path='/messages' element={
            <Dashboard 
              tracks={tracks} 
              msg={msg} 
              monitoring={monitoring}
              notifications = {notifications}
              openDataWindow = {openDataWindow}
            /> } />
           
        </Routes>
      </div>
    </>
  )
}

export default BaseRouter
