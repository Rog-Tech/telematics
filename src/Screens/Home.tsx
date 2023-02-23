import React from "react";

import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";

import "./Home.css";
export const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li><a href="#home">דף בת</a></li>
          <li><a href="#news">אודות</a></li>
          <li><a href="#contact">צרו קשר</a></li>
          <li style={{float:"right"}}></li>
        </ul>
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
