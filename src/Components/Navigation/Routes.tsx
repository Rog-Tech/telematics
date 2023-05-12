import React from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Analytics } from '../../Screens/Analytics'
import { Dashboard } from '../../Screens/Fragments/Dashboard'
import NavBar from './nav/NavBar'
import './Header.css'
import { CarProps } from '../../types/Types'
import axios from 'axios'
import { getFullUrl } from '../../Utils/Helper'

type Account = {
  id: number;
  name: string;
};

type ParentCar = {
  accountDto: Account;
  cars: CarProps[];
};

type ChildCar = {
  accountDto: Account;
  cars: CarProps[];
};

type GpsSystemCar = {
  parent: ParentCar;
  child: ChildCar[];
};

type GpsSystem = {
  gpsSystem: string;
  gpsSystemCars: GpsSystemCar[];
};





const BaseRouter = (props:any) => {
  const currentRoute = useLocation()
  const navigate = useNavigate();
  const [tracks,setTracks] = React.useState(false);
  const [msg,setMsg] = React.useState(false);
  const [monitoring,setMonitoring] = React.useState(true);
  const [notifications,setNotifications] = React.useState(false)
  const [geofence,setGeofence] = React.useState(false)
  const refreshToken = JSON.parse(window.localStorage.getItem('refreshToken') || '{}');
  const token= refreshToken.token
  const [modal, setmodal] = React.useState(true)
  const [data,setData] = React.useState(Array<CarProps>());
 
  React.useEffect(() => {
   if (!token) {
    return
   }
    const interval = setInterval(async () => {
      axios.get(getFullUrl(`/api/v1/gps/cars?token=${token}`)).then((res)=>{
        const  x = res.data as Array<GpsSystem>
        const allCars = extractCars(x)
    

        // const allCars: CarProps[] = x.reduce<CarProps[]>((acc, gpsSystem) => {
        //   const cars = gpsSystem.gpsSystemCars.reduce<CarProps[]>((acc, gpsSystemCar) => {
        //     const parentCars = gpsSystemCar.parent.cars;
        //     const childCars = gpsSystemCar.child.reduce<CarProps[]>((acc, child) => {
        //       return [...acc, ...child.cars];
        //     }, []);
        //     return [...acc, ...parentCars, ...childCars];
        //   }, []);
        //   return [...acc, ...cars];
        // }, []);
        
     
        
        setData(allCars)

      }).catch(()=>{
        // console.log(error)
      })
    }, 1500);

    // clean up
    return () => clearInterval(interval);
  }, []);

  const dashboardComponent = (
    <Dashboard 
      tracks={tracks} 
      msg={msg} 
      monitoring={monitoring}
      notifications = {notifications}
      geofence = {geofence}
      openModal = {modal}
    />
  );
  const NavBarMemoized = React.useCallback(() => (
    <NavBar  
      setTracks={setTracks} 
      setMsg={setMsg} 
      setMonitoring={setMonitoring}
      setNotifications={setNotifications}
      setGeofence = {setGeofence}
    />
  ), [setTracks, setMsg, setMonitoring, setNotifications,setGeofence]);

  return (
    <>
      <NavBarMemoized />
      <div>
        <Routes>
            <Route
                path="/monitoring"
                element={
                  <ProtectedRoutes isSignedIn={props.isAuthenticated}>
                    {dashboardComponent}
                  </ProtectedRoutes>
                }
            />
            <Route
                path="/notifications"
                element={
                  <ProtectedRoutes isSignedIn={props.isAuthenticated}>
                    {dashboardComponent}
                  </ProtectedRoutes>
                }
            />
            <Route
                path="/analytics"
                element={
                  <ProtectedRoutes isSignedIn={props.isAuthenticated}>
                    <Analytics data={data} />
                  </ProtectedRoutes>
                }
            />

          <Route
                path="/tracks"
                element={
                  <ProtectedRoutes isSignedIn={props.isAuthenticated}>
                    {dashboardComponent}
                  </ProtectedRoutes>
                }
            />
            <Route
                path="/messages"
                element={
                  <ProtectedRoutes isSignedIn={props.isAuthenticated}>
                    {dashboardComponent}
                  </ProtectedRoutes>
                }
            />
            <Route
                path="/geofence"
                element={
                  <ProtectedRoutes isSignedIn={props.isAuthenticated}>
                    {dashboardComponent}
                  </ProtectedRoutes>
                }
            />
            <Route
                path="/notifications:carId/:alarmId"
                element={
                  <ProtectedRoutes isSignedIn={props.isAuthenticated}>
                    {dashboardComponent}
                  </ProtectedRoutes>
                }
            />                  
        </Routes>
      </div>
    </>
  )
}

export const extractCars = (data: any) => {
  const cars: CarProps[] = [];

  data.forEach((gpsData: any) => {
    gpsData.gpsSystemCars.parent.cars.forEach((car: CarProps) => {
      cars.push(car);
    });
    gpsData.gpsSystemCars.child.forEach((childAccount: any) => {
      childAccount.cars.forEach((car: CarProps) => {
        cars.push(car);
      });
    });
  });

  return cars;
};
export default BaseRouter

interface ProtectedRoutesProps {
  isSignedIn : boolean;
  children:any
}

export const  ProtectedRoutes = ({ isSignedIn, children }:ProtectedRoutesProps)=> {
  if (!isSignedIn) {
    return <Navigate to="/" replace />
  }
  return children
}
