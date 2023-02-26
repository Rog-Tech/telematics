import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from 'styled-components'

const Ul = styled.ul<{open:boolean}>`
    list-style:none;
    display:flex;
    flex-flow:row nowrap;
   
    li{
      padding: 18px 10px !important;
    }
    @media (max-width:768px) {
        flex-flow:column nowrap;
        background-color:blue; 
        position:fixed;
        transform:${({open})=> open ? 'translateX(0)' : 'translateX(100%)'};
        right:0;
        top:0;
        height:100vh;
        width:250px;
        padding-top:3.5rem;
        transition:transform 0.3s ease-in-out;

        li{
            color:white;
            font-weight:400px;
            font-size:14px;
            cursor:pointer;

            a{
               text-decoration: none;
               color:blue;
               font-weight:500;
            }
            i{
              color:blue;
              font-weight:500;
            }
        }
    }
  
`
const RightNav = (props:any) => {
    const [activeDiv, setActiveDiv] = React.useState<number | null>(6);

    const setSelectedTab = (type: "Monitoring" | "Messages" | "Tracks" | "Geofence" | "Notifications" |"Analytics") =>{
      switch (type) {
        case "Analytics":
            props.setTracks(false) 
            props.setMsg(false) 
            props.setmonitoring(false) 
            props.setNotifications(true) 
            setActiveDiv(1) 
            break; 
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
        default:
          break;
      }
    }

    
  return (
    <Ul open={props.open}>
        <li className= {activeDiv ===1 ? "header-items active-links" : "header-items"}>
         <NavLink to='/analytics' >
            <i className="pi pi-chart-bar"  style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>לוח בקרה</NavLink>
        </li>
        <li className= {activeDiv ===2 ? "header-items active-links" : "header-items"}>
            <i className="pi pi-globe"  style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>מעקב חי
        </li>
        <li className= {activeDiv ===3 ? "header-items active-links" : "header-items"}>
            <i className="pi pi-comments"  style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>הודעות
        </li>
        <li className= {activeDiv ===4 ? "header-items active-links" : "header-items"}>
           
            <i className="pi pi-flag-fill"  style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>מסלולים
        </li>
        {/* <li className= {activeDiv ===5 ? "header-items active-links" : "header-items"}>
           
            <i className="pi pi-map"  style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>גדרות גיאוגרפיות
        </li> */}
        <li className= {activeDiv === 5 ? "header-items active-links" : "header-items"}>
           
            <i className="pi pi-bell"  style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>התרעות
        </li>
        <li>
            <i className="pi pi-ellipsis-v" style={{ fontSize: '1.5rem' }}></i>
        </li>
        <li>Administrator</li>
    </Ul>
  )
}

export default RightNav
