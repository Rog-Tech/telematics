import axios from 'axios';
import { count } from 'console';
import React, { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import GrowlContext from '../../../Utils/growlContext';
import { getFullUrl } from '../../../Utils/Helper';
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
        z-index:505;
        .signout{
          display:flex;
          justify-content: flex-end;
          color: brown;
          font-weight: bold;
          font-size: 1rem;
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
        .user{
          font-size: 12px;
          margin-right: 0px;
          margin-left: 7px;
        }
    }
  
`
const RightNav = (props:any) => {

  const growl = React.useContext(GrowlContext)
  const usrCtx = JSON.parse( window.localStorage.getItem('refreshToken')!)
  const {name,token} =  usrCtx;
  const navigate = useNavigate();
  const currentRoute = useLocation()
  const currentPath = currentRoute.pathname;
  const[selected,setselected] = useState("Monitoring");

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



    const logOut = ()=>{
      axios.post(getFullUrl(`/api/v1/auth/logout?token=${token}`),{
      
      }).then((res)=>{
  
        growl.current.show({
          summary:"You have logged out",
          severity:'success'
         })

         navigate('/')
         window.localStorage.removeItem("refreshToken")
      }).catch((error)=>{
       growl.current.show({
        summary:"Could not log you out",
        severity:'error'
       })
      })
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

  function useSingleAndDoubleClick(actionSimpleClick: () => void, actionDoubleClick: () => void, delay = 250) {
    const [click, setClick] = useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            // simple click
            if (click === 1) actionSimpleClick();
            setClick(0);
        }, delay);

        // the duration between this click and the previous one
        // is less than the value of delay = double-click
        if (click === 2) actionDoubleClick();

        return () => clearTimeout(timer);
        
    }, [click]);

    return () => setClick(prev => prev + 1);
}

// TO  DO 
const callbackDoubleClick =()=>{
    props.setOpenDataWindow(false)
}
const callbackClick =()=>{
  props.setOpenDataWindow(true)
}
const click = useSingleAndDoubleClick(callbackClick, callbackDoubleClick);


  
  return (
    <Ul open={props.open}>
        <NavLink to='/analytics' className={({ isActive }) =>
            (isActive ? "active-links" : "link")}>
            <i className="pi pi-chart-bar" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            בקרה
        </NavLink>


        <NavLink to='/monitoring' className={({ isActive }) =>
            activeDiv(isActive,"Monitoring")}>
            <i className="pi pi-globe" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            מעקב חי
        </NavLink>

    
        <NavLink to='/messages' className={({ isActive }) =>
            activeDiv(isActive,"Messages")}>
            <i className="pi pi-comments" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            הודעות
        </NavLink>

        <NavLink to='/tracks' className={({ isActive }) =>
            activeDiv(isActive,"Tracks")}>
            <i className="pi pi-flag-fill" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            מסלולים
        </NavLink>
       
        <NavLink to='/notifications' className={({ isActive }) =>
            activeDiv(isActive,"Notifications")}>
            <i className="pi pi-bell" style={{'fontSize': '0.8rem', marginRight:"10px"}}></i>
            התרעות
        </NavLink>
        <li className='elipse'>
            <i className="pi pi-ellipsis-v" style={{ fontSize: '1.5rem' }}></i>
        </li>
        <li className='elipse' onClick={logOut}>{name}</li>
        <li  onClick={logOut} className='signout'><i className="pi pi-power-off" style={{ fontSize: '1rem' }}></i><strong className='user'>{name}</strong></li>
    </Ul>
  )
}

export default RightNav

