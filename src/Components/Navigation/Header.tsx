import React from 'react'
import { NavLink } from 'react-router-dom'
import {Divider} from 'primereact/divider'
import './Header.css'
const Header = () => {
  return (
    <div className='header-container grid'>
      <div className='col-1 logo'>
        <p>Logo</p>
      </div>
      <div className="col-8 header-item-menu">
          <div className='header-items'>
              <NavLink to='/dashboard' className={({ isActive }) =>
                    (isActive ? "active-links" : "link")}>
                      <i className="pi pi-chart-bar" style={{'fontSize': '1.2rem', marginRight:"10px"}}></i>
                      Dashboard</NavLink>
          </div>
          <Divider layout="vertical" />
          <div className='header-items'>
              <NavLink to='/dashboard' className={({ isActive }) =>
                    (isActive ? "active-links" : "link")}>
                      <i className="pi pi-globe" style={{'fontSize': '1.2rem', marginRight:"10px"}}></i>
                      Monitoring</NavLink>
          </div>
          <Divider layout="vertical" />
          <div className='header-items'>
              <NavLink to='/dashboard' className={({ isActive }) =>
                    (isActive ? "active-links" : "link")}>
                      <i className="pi pi-bell" style={{'fontSize': '1.2rem', marginRight:"10px"}}></i>
                      Messages</NavLink>
          </div>
          <Divider layout="vertical" />
          <div className='header-items'>
              <NavLink to='/dashboard' className={({ isActive }) =>
                    (isActive ? "active-links" : "link")}>
                      <i className="pi pi-truck" style={{'fontSize': '1.2rem', marginRight:"10px"}}></i>
                      Tracks</NavLink>
          </div>
          <Divider layout="vertical" />
          <div className='header-items'>
              <NavLink to='/dashboard' className={({ isActive }) =>
                    (isActive ? "active-links" : "link")}>
                      <i className="pi pi-map" style={{'fontSize': '1.2rem', marginRight:"10px"}}></i>
                      Geofence</NavLink>
          </div>
      </div>
      <i className="pi pi-ellipsis-v header-eclipse"></i>
       <div className="col-3">
      
          <div className='user'>
            <p>Chann</p>
          </div>
      </div>
    </div>
  )
}

export default Header
