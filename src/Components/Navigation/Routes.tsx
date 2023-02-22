import { Divider } from 'primereact/divider'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Analytics } from '../../Screens/Analytics'
import { Dashboard } from '../../Screens/Fragments/Dashboard'
import { Geofence } from '../../Screens/Fragments/Geofence'
import { Messages } from '../../Screens/Fragments/Messages'
import { Tracks } from '../../Screens/Fragments/Tracks'
import MapWrapper from '../Map/MapWrapper'
import Header from './Header'

const BaseRouter = () => {
  const [tracks,setTracks] = React.useState(false);
  const [msg,setMsg] = React.useState(false);
  const [monitoring,setMonitoring] = React.useState(false);
  const [notifications,setNotifications] = React.useState(true)
  return (
    <div className='grid grid-nogutter'>
      <div className='col-12 md:col-6 lg:col-12 top-bar'>
          <Header 
            setTracks={setTracks} 
            setMsg={setMsg} 
            setmonitoring={setMonitoring}
            setNotifications={setNotifications}
            />
      </div>

      <div className="col-12 md:col-6 lg:col-12">
          <Routes>
            <Route path='/dashboard' element={
              <Dashboard 
                  tracks={tracks} 
                  msg={msg} 
                  monitoring={monitoring}
                  notifications = {notifications}
                  /> } />
            <Route path='/analytics' element={<Analytics /> } />
          </Routes>
      </div>
    </div>
  )
}

export default BaseRouter
