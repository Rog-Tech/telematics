import React from 'react'
import styled from 'styled-components'
import RightNav from './RightNav';

const StyledHumbugger = styled.div<{open:boolean}>`
    width:2rem;
    height:2rem;
    position:relative;
    top:15px;
    right:20px;
    z-index:100;
    display:none;

    @media (max-width: 768px) {
        display:flex;
        justify-content:space-around;
        flex-flow:column nowrap;
    }


    div{
        width:2rem;
        height:0.25rem;
        background-color:${({open})=> open ? '#007ad9a6' : '#333'};
        border-radius:10px;
        transform-origin:1px;
        transition:all 0.3s linear;

        &:nth-child(1){
            transform:${({open})=> open ? 'rotate(45deg)' : 'rotate(0)'};
        }

        &:nth-child(2){
            transform:${({open})=> open ? 'translateX(100%)' : 'translateX(0)'};
            opacity:${({open})=> open ? '0' : '1'};
        }

        &:nth-child(3){
            transform:${({open})=> open ? 'rotate(-45deg)' : 'rotate(0)'};
        }
    }

`
const Burger = (props:any) => {
    const [open, setOpen] = React.useState(false);
  return (
    <>
    <StyledHumbugger open={open} onClick={()=>setOpen(!open)}>
        <div />
        <div />
        <div />
    </StyledHumbugger>
    <RightNav open={open}
         current={props.setcurrentMenu}   
         setTracks={props.setTracks} 
         setMsg={props.setMsg} 
         setMonitoring={props.setMonitoring}
         setNotifications={props.setNotifications}
    />
    </>
  )
}

export default Burger
