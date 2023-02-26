import React from 'react'
import styled from 'styled-components'
import Burger from './Burger'
import RightNav from './RightNav'
import logo  from '../../../assets/logo.png'
const Nav  = styled.nav`
  width:100%;
  height:60px;
  border-bottom: 2px solid #c5c5c5;
  padding: 0 10px;
  display:flex;
  justify-content:space-between;
  .logo{
    padding:15px 0;
  }

  img{
    width: 5rem;
    /* margin: 3px;
    position: absolute;
    left: 0;
    padding: 3px; */
  }

  
`
const NavBar = (props:any) => {
  return (
    <Nav>
      <div className="logo">
        <img className='header-logo' src={logo} alt="" />
      </div>
     <Burger /> 
    </Nav>
  )
}

export default NavBar
