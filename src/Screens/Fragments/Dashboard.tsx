import React from 'react'
import MapWrapper from '../../Components/Map/MapWrapper'
import Header from '../../Components/Navigation/Header'

export const Dashboard = () => {
  return (
    <div className='grid'>
      <div className="col-12 md:col-6 lg:col-3">
       <Header />
      </div>
      <div className="col-12 md:col-6 lg:col-3">
          <MapWrapper />
      </div>
    </div>
  )
}
