import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Geofence } from '../../Screens/Fragments/Geofence'
import { Messages } from '../../Screens/Fragments/Messages'
import { Tracks } from '../../Screens/Fragments/Tracks'
import MapWrapper from '../Map/MapWrapper'

const BaseRouter = () => {

  return (
    <div className='grid'>
        <div className="grid">
          {/* navbar */}
        </div>
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-4">
            <Routes>
              <Route path='/geofence' element={<Geofence />} />
              <Route path='/notifications' element={<Messages />} />
              <Route path='/tracks' element={<Tracks />} />
            </Routes>
          </div>
          <Routes>
            <Route path='/mapview' element={<MapWrapper />} />
          </Routes>
        </div>
    </div>
  )
}

export default BaseRouter
