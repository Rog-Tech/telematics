import React from 'react'
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./Home.css";
import axios from 'axios';
import { CarHistoryProps } from '../types/Types';
import { basicAuth, Token } from '../Utils/constants';
import { getFullUrl } from '../Utils/Helper';
import GrowlContext from '../Utils/growlContext';
import { Buffer } from 'buffer';
const MainContainer = styled.div`
  .navbar{
    display:flex;
    justify-content:end;
    position: fixed;
    background: linear-gradient(to bottom, #002d47, #011c2c);
    width: 100%;
  }
  .image-icon{
    opacity: 0.5;
    max-width: 100%;
    height: 100vh;
    display: block;
    /* margin: 0 auto; */
    }
    @media (max-width: 768px) {
      .image-icon{
        object-fit:contain;
        display:none;
      }
      .container{
        justify-content:center;
      }
      
    }

`
const StyledUl = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: linear-gradient(to bottom, #002d47, #011c2c);

    li{
      float: left;
      a{
        display: block;
        color: #f1f1f1;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;

        &:hover{
          background-color: #007ad9;
        }
      }
    }

`
const styledButton = styled(Button)`
  margin: 5px;
`
const StyledInputGroup = styled.div`
    display:grid;
`
const StyledCard = styled.div`
    max-height: 345px;
    min-height: 206px;
    width: 250px;
    margin-right: 25px;
    margin-left: 25px;
    margin-top: 40px;
    margin-bottom: 20px;
    border-style: solid;
    border-width: 0px 0px 0px 0px;
    padding: 15px 25px 15px 25px;
    box-shadow: 0px 2px 8px 0px rgb(9 73 255 / 49%);
    background-color: white;
    border-radius: 15px;
    opacity: 1;
    /* position: absolute; */ 
    @media (max-width: 768px) {
       position: absolute; 
    }

    button{
      margin-top:10px;
      border-radius:24px;
      width:6rem;
    }
    input{
      height:2rem;
      border-radius:24px;
      width:100%;
    }
    .button-inline{
      display:flex;
      justify-content:center;
    }
    .app-title{
      display:flex;
      justify-content:center;
      margin-bottom:15px;
      font-weight:500;
    }
    
`

type userContext = {
  name:string;
  token:string;
}
export const Home = () => {
  const growl = React.useContext(GrowlContext);
  const navigate = useNavigate();
  const [username, setusername] = React.useState("")
  const [password, setPassword] = React.useState("")

  const canSave = username !== "" || password !== "";
  const login = ()=>{

    let token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
    axios.post(getFullUrl(`/api/v1/auth/login?login=${username}&password=${password}`),{
      
    }).then((res)=>{

      const userContext :userContext = {
        name: username, token:res.data
      }
      window.localStorage.setItem("refreshToken",JSON.stringify(userContext))

      navigate("/monitoring")
    }).catch((error)=>{
     growl.current.show({
      summary:"Invalid Details",
      severity:'error'
     })
    })
  }

  return (
    <MainContainer>
      <nav className="navbar">
        <StyledUl>
          <li><a href="#contact">צרו קשר</a></li>
          <li><a href="#news">אודות</a></li>
          <li><a href="#home">דף בית</a></li>
          <li style={{float:"right"}}></li>
        </StyledUl>
      </nav>
    <div className="container">
      {/* <video className="fullscreen" id="background-video" autoPlay loop muted>
        <source src={require("../assets/Scene-01.mp4")} type="video/mp4" />
      </video> */}
      <img className='image-icon' src={require("../assets/arity.png")} alt="" />
      <StyledCard>
           <div className='app-title'>
              <p>Rog Tec Telematics</p>
           </div>
         
          <StyledInputGroup>
              <label >מייל</label>
              <InputText id="email" type="email" onChange={(e)=>setusername(e.target.value)}/>
          </StyledInputGroup>
          <StyledInputGroup>
                <label>סיסמה</label><br></br>
                <InputText id="password" type="password" onChange={(e)=>setPassword(e.target.value)} />
          </StyledInputGroup>
        
         <div className='button-inline'>
             <Button disabled={!canSave} onClick={login} label="כניסה" />
         </div>
      </StyledCard>
    </div>
    </MainContainer>
  );
};
