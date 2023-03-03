import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
interface StyledNavLinkProps {
  activeClassName: string;
}

const StyledNavLink = styled(NavLink)<StyledNavLinkProps>`
  &.${props => props.activeClassName} {
    color: red;
  }
`;


const Ul = styled.ul<{open:boolean}>`
    list-style:none;
    display:flex;
    flex-flow:row nowrap;
    .signout{
      display:none;
    }
   a{
    padding: 18px 10px !important;
    cursor: pointer;
    text-decoration:none;
    color:blue;
   }
    li{
      padding: 18px 10px !important;
      cursor: pointer;
    }
    @media (max-width:768px) {
        flex-flow:column nowrap;
        background-color:#ddd9d9f0; 
        position:fixed;
        transform:${({open})=> open ? 'translateX(0)' : 'translateX(100%)'};
        right:0;
        top:0;
        height:100vh;
        width:250px;
        padding-top:3.5rem;
        transition:transform 0.3s ease-in-out;
        z-index:60;
        .signout{
          display:flex;
          justify-content: flex-end;
          color: brown;
          font-weight: bold;
          font-size: 2rem;
        }
        .elipse{
          display:none;
        }
        li{
            color:white;
            font-weight:400px;
            font-size:14px;
            cursor:pointer
        }
    }
  
`
const RightNav = (props:any) => {
    const navigate = useNavigate();
  const setSelectedTab = (type: "Monitoring" | "Messages" | "Tracks" | "Geofence" | "Notifications" | "Analytics") =>{
    switch (type) {
       case "Monitoring":
        props.setTracks(false)
        props.setMonitoring(true) 
        props.setMsg(false) 
        props.setNotifications(false)
        break;
      case "Messages":
        props.setTracks(false) 
        props.setMsg(true) 
        props.setMonitoring(false) 
        props.setNotifications(false) 
        break;
      case "Tracks":
        props.setTracks(true) 
        props.setMsg(false) 
        props.setMonitoring(false) 
        props.setNotifications(false) 
        break;
      case "Notifications":
        props.setTracks(false) 
        props.setMsg(false) 
        props.setMonitoring(false) 
        props.setNotifications(true) 
        break;  
      default:
        break;
    }
  }

  const activeDiv = (isActive:boolean, currenttab:any)=>{
    if(isActive){
      setSelectedTab(currenttab)
      props.current(currenttab)
      return 'active-links'
    }else{
      return 'links'
    }
  }
  return (
    <Ul open={props.open}>
        <NavLink to='/analytics' className={({ isActive }) =>
            (isActive ? "active-links" : "link")}>
            <i className="pi pi-chart-bar" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            בקרה
        </NavLink>


        <NavLink to='/monitoring' className={({ isActive }) =>
            activeDiv(isActive,"Monitoring")} >
            <i className="pi pi-globe" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            מעקב חי
        </NavLink>

      

        <NavLink to='/msg' className={({ isActive }) =>
            activeDiv(isActive,"Messages")} >
            <i className="pi pi-comments" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            הודעות
        </NavLink>

        <NavLink to='/tracks' className={({ isActive }) =>
            activeDiv(isActive,"Tracks")} >
            <i className="pi pi-flag-fill" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            מסלולים
        </NavLink>
       
        <NavLink to='/dashboard' className={({ isActive }) =>
            activeDiv(isActive,"Notifications")} onClick={()=> setSelectedTab("Notifications")}>
            <i className="pi pi-bell" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            התרעות
        </NavLink>
        <li className='elipse'>
            <i className="pi pi-ellipsis-v" style={{ fontSize: '1.5rem' }}></i>
        </li>
        <li className='elipse' onClick={()=> navigate('/')}>Administrator</li>
        <li className='signout'> <i onClick={()=> navigate('/')} className="pi pi-power-off" style={{ fontSize: '1.5rem' }}></i></li>
    </Ul>
  )
}

export default RightNav
