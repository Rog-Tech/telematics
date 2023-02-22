import React from 'react';
import './App.css';
import "primereact/resources/themes/nova-accent/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.min.css";                                           
import GrowlContext from './Utils/growlContext';
 import {Toast as Growl} from 'primereact/toast'         
import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './Screens/Home';
import { Dashboard } from './Screens/Fragments/Dashboard';
import BaseRouter from './Components/Navigation/Routes';
import { Analytics } from './Screens/Analytics';
function App() {
  const currentRoute = useLocation()
  const isHomePage = currentRoute.pathname === "/" ;
  const growl= React.useRef()
  return (
    <GrowlContext.Provider value={growl as any}>
         <Growl ref={(el) => (growl.current = el as any)} />
         <Routes>
          <Route path='/' element={<Home />}></Route>
         </Routes>
         {
          !isHomePage && (<BaseRouter />)
         }
    </GrowlContext.Provider>
  );
}

export default App;
