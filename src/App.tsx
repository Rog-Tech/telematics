import React from 'react';
import './App.css';
import "primereact/resources/themes/nova-accent/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.min.css";                                           
import GrowlContext from './Utils/growlContext';
 import {Toast as Growl} from 'primereact/toast'         
import { Route, Routes, useLocation,useNavigate } from 'react-router-dom';
import { Home } from './Screens/Home';
import BaseRouter from './Components/Navigation/Routes';
import logo from './assets/logo.png'



function App() {
  const currentRoute = useLocation()
  const isHomePage = currentRoute.pathname === "/" ;
  const growl= React.useRef()
  const refreshToken = JSON.parse(window.localStorage.getItem('refreshToken') || '{}');
  const [isAuthenticated, setIsAuthenticated] = React.useState(refreshToken.isAuthenticated || false);
  const navigate = useNavigate();
  const [routeUnitId,setRouteUnitId] = React.useState<string>();
  const [routeAlarmId,setRouteAlarmId] = React.useState<string>();

  React.useEffect(() => {
    // Check if the URL matches the specific pattern
    const regex = /^\/notifications\/\d+\/[a-zA-Z0-9-]+$/;
  
    if (regex.test(currentRoute.pathname)) {

      const paramsArray = currentRoute.pathname.split("/");
      const carId = paramsArray[2];
      const alarmId = paramsArray[3];
      console.log("Car ID:", carId);
      console.log("Alarm ID:", alarmId);
      setRouteUnitId(carId)
      setRouteAlarmId(alarmId)
      navigate('/notifications', { state: { carId,alarmId } });
    }
  }, [navigate, currentRoute.pathname]);

  return (
    <GrowlContext.Provider value={growl as any}>
         <Growl ref={(el) => (growl.current = el as any)} />
         <Routes>
          <Route index path="/gps"
              element={<Home setIsAuthenticated={setIsAuthenticated} 
              routeUnitId={routeUnitId} routeAlarmId={routeAlarmId} />}></Route>
       
          <Route path="/" element={
            <div className="welcome-page">
               <p>Rog tech dev center</p>
               <img src={logo} alt=''/>
            </div>}/>
         </Routes>
         <BaseRouter 
           isAuthenticated={isAuthenticated} 
           setRouteUnitId={setRouteUnitId} setRouteAlarmId={setRouteAlarmId}/>
       
    </GrowlContext.Provider>
  );
}

export default App;
