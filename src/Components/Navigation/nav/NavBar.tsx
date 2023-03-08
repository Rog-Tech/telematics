import React from 'react'
import styled from 'styled-components'
import Burger from './Burger'
import RightNav from './RightNav'
import logo  from '../../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
const Nav  = styled.nav`
  width:100%;
  height:60px;
  border-bottom: 2px solid #c5c5c5;
  padding: 0 10px;
  display:flex;
  justify-content:space-between;
  position:inherit;
  .currentMenu{
    display:none;
  }
  .logo{
    padding:4px 0;
    cursor: pointer;
  }

  img{
    width: 5rem;
    /* margin: 3px;
    position: absolute;
    left: 0;
    padding: 3px; */
  }

  @media (max-width: 768px) {
    .currentMenu{
        display:flex;
    }
  } 
`
const NavBar = (props:any) => {
  const navigate = useNavigate();
  const [currentMenu, setcurrentMenu] = React.useState("Notifications");

  return (
    <Nav>
      <div className="logo">
        <img className='header-logo' src={logo} alt="" onClick={()=> navigate('/')} />
      </div>
      
     <Burger 
      setcurrentMenu = {setcurrentMenu}
      setTracks={props.setTracks} 
      setMsg={props.setMsg} 
      setMonitoring={props.setMonitoring}
      setNotifications={props.setNotifications}
      setOpenDataWindow={props.setOpenDataWindow}
     /> 
    </Nav>
  )
}

export default NavBar
