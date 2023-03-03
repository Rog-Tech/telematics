import axios from 'axios'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Divider } from 'primereact/divider'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Analytics } from '../../Screens/Analytics'
import { Dashboard } from '../../Screens/Fragments/Dashboard'
import { Geofence } from '../../Screens/Fragments/Geofence'
import { Messages } from '../../Screens/Fragments/Messages'
import { Tracks } from '../../Screens/Fragments/Tracks'
import { CarAlarmProps, CarProps } from '../../types/Types'
import { Token } from '../../Utils/constants'
import { getFullUrl } from '../../Utils/Helper'
import MapWrapper from '../Map/MapWrapper'
import Header from './Header'
import NavBar from './nav/NavBar'
import './Header.css'

const BaseRouter = () => {
  const [tracks,setTracks] = React.useState(false);
  const [msg,setMsg] = React.useState(false);
  const [monitoring,setMonitoring] = React.useState(true);
  const [notifications,setNotifications] = React.useState(false)

  // pull the dataset here
  return (
    <>
      <NavBar  
            setTracks={setTracks} 
            setMsg={setMsg} 
            setMonitoring={setMonitoring}
            setNotifications={setNotifications}
      />
      <div>
        <Routes>
          <Route path='/monitoring' element={
              <Dashboard 
                tracks={tracks} 
                msg={msg} 
                monitoring={monitoring}
                notifications = {notifications}
              /> } />
           <Route path='/dashboard' element={
              <Dashboard 
                tracks={tracks} 
                msg={msg} 
                monitoring={monitoring}
                notifications = {notifications}
              /> } 
            />
            <Route path='/analytics' element={<Analytics /> } />
            <Route path='/tracks' element={
              <Dashboard 
                tracks={tracks} 
                msg={msg} 
                monitoring={monitoring}
                notifications = {notifications}
              /> } 
            />
            <Route path='/msg' element={
            <Dashboard 
              tracks={tracks} 
              msg={msg} 
              monitoring={monitoring}
              notifications = {notifications}
            /> } />
           
        </Routes>
      </div>
    </>
  )
}

export default BaseRouter
