import React from 'react'
import { NavLink } from 'react-router-dom'
import {Divider} from 'primereact/divider'
import './Header.css'
import logo from '../../assets/logo.png'

const Header = (props:any) => {

  const [activeDiv, setActiveDiv] = React.useState<number | null>(5);

  const setSelectedTab = (type: "Monitoring" | "Messages" | "Tracks" | "Geofence" | "Notifications") =>{
    switch (type) {
      case "Monitoring":
        props.setTracks(false)
        props.setmonitoring(true) 
        props.setMsg(false) 
        props.setNotifications(false)
        setActiveDiv(2) 
        break;
      case "Messages":
        props.setTracks(false) 
        props.setMsg(true) 
        props.setmonitoring(false) 
        props.setNotifications(false) 
        setActiveDiv(3) 
        break;
      case "Tracks":
        props.setTracks(true) 
        props.setMsg(false) 
        props.setmonitoring(false) 
        props.setNotifications(false) 
        setActiveDiv(4) 
        break;
      case "Notifications":
        props.setTracks(false) 
        props.setMsg(false) 
        props.setmonitoring(false) 
        props.setNotifications(true) 
        setActiveDiv(5) 
        break;  
      case "Geofence":
        break;
      default:
        break;
    }
  }
  return (
      <div className="grid">
        <div className="col-6 md:col-6 lg:col-3">
           <img className='header-logo' src={logo} alt="" />
        </div>
        <div className="col-12 md:col-6 lg:col-7 main-menu">2</div>
        <div className="col-6 md:col-6 lg:col-2">
        
        </div>
      </div>
      // <div className="grid grid-nogutter">
      //     <div className="col-12 md:col-6 lg:col-3">
      //       <img className='header-logo' src={logo} alt="" />
      //     </div>

      //     <div className="col-12 md:col-6 lg:col-7">
      //         <div className="items">
      //             <div  onClick={() => setActiveDiv(1)} className= {activeDiv ===1 ? "header-items active-links" : "header-items"} >
      //               <NavLink to='/analytics' >
      //                 <i className="pi pi-chart-bar"  style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
      //                 לוח בקרה</NavLink>
      //             </div>
      //             <div className= {activeDiv ===2 ? "header-items active-links" : "header-items"}>
      //               <NavLink to='/dashboard' onClick={()=> setSelectedTab("Monitoring")}>
      //                   <i className="pi pi-globe" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
      //                   מעקב חי</NavLink>
      //             </div>
      //             <div className= {activeDiv ===3 ? "header-items active-links" : "header-items"}>
      //                <NavLink onClick={()=>setSelectedTab("Messages")} to='/dashboard' >
      //                   <i className="pi pi-comments" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
      //                     הודעות</NavLink>
      //              </div>
      //              <div className= {activeDiv ===4 ? "header-items active-links" : "header-items"}>
      //                 <NavLink onClick={()=>setSelectedTab("Tracks")} to='/dashboard'>
      //                  <i className="pi pi-flag-fill" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
      //                  מסלולים</NavLink>
      //               </div>
      //               {/* <div className='header-items'>
      //                 <NavLink to='/dashboard'>
      //                   <i className="pi pi-map" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
      //                  גדרות גיאוגרפיות</NavLink>
      //               </div> */}
      //               <div className= {activeDiv ===5 ? "header-items active-links" : "header-items"}>
      //                 <NavLink onClick={()=>setSelectedTab("Notifications")} to='/dashboard' >
      //                   <i className="pi pi-bell" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
      //                  התרעות</NavLink>
      //               </div>
      //         </div>
      //     </div>
      //     <div className="col-12 md:col-6 lg:col-2">
      //         <div className='user'>
      //         <i className="pi pi-ellipsis-v header-eclipse"></i>
      //           <p>Administrator</p>
      //         </div>
      //     </div>
      // </div>
  )
}

export default Header
