import React from 'react';
import './App.css';
import "primereact/resources/themes/nova-accent/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";                                         
import GrowlContext from './Utils/growlContext';
 import {Toast as Growl} from 'primereact/toast'         
import { Route, Routes } from 'react-router-dom';
import { Home } from './Screens/Home';
import { Dashboard } from './Screens/Fragments/Dashboard';
import BaseRouter from './Components/Navigation/Routes';
import { Analytics } from './Screens/Analytics';
function App() {
  const growl= React.useRef()
  return (
    <GrowlContext.Provider value={growl as any}>
         <Growl ref={(el) => (growl.current = el as any)} />
         <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/analytics' element={<Analytics />}></Route>
         </Routes>
         <BaseRouter />
    </GrowlContext.Provider>
  );
}

export default App;
