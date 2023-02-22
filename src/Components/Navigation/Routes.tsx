import axios from 'axios'
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

const BaseRouter = () => {
  const [tracks,setTracks] = React.useState(false);
  const [msg,setMsg] = React.useState(false);
  const [monitoring,setMonitoring] = React.useState(false);
  const [notifications,setNotifications] = React.useState(true)
  const [data,setData] = React.useState(Array<CarAlarmProps>());
  React.useEffect(() => {
    const interval = setInterval(async () => {
      axios.get(getFullUrl('/api/v1/gps/cars'),{
        headers:{
          'Authorization': `Basic ${Token}`
        }
      }).then((res)=>{
           const d = res.data as Array<CarAlarmProps>
        setData(d)
      }).catch((error)=>{
        console.log(error)
      })
      //  pull  data after  every 1 update to suitable time 

    }, 30000);

    // clean up
    return () => clearInterval(interval);
  }, []);
  // pull the dataset here
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
            <Route path='/analytics' element={<Analytics data={data}/> } />
          </Routes>
      </div>
    </div>
  )
}

export default BaseRouter
