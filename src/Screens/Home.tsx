
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./Home.css";
const StyledUl = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #e9edf4b7;

    li{
      float: left;
      a{
        display: block;
        color: rgb(3, 3, 3);
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;

        &:hover{
          background-color: #007ad9;
        }
      }
    }

`
export const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="navbar">
        <StyledUl>
          <li><a href="#home">דף בת</a></li>
          <li><a href="#news">אודות</a></li>
          <li><a href="#contact">צרו קשר</a></li>
          <li style={{float:"right"}}></li>
        </StyledUl>
      </nav>
    <div className="container">
      <video className="fullscreen" id="background-video" autoPlay loop muted>
        <source src={require("../assets/Scene-01.mp4")} type="video/mp4" />
      </video>
      <div className="card">
          <img src="https://rog-tech.com/wp-content/uploads/2022/03/laptop.svg" alt="laptop" />
          <label >מייל</label><br></br>
          <input id="email" type="email" />
          <label>סיסמה</label><br></br>
          <input id="password" type="password"  />
          <Button onClick={() => navigate("/dashboard")} label="כניסה" />
      </div>
    </div>
    </div>
  );
};
