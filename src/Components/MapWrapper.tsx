import React, { FC } from 'react'
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import car from './../assets/car.png' // TO DO

interface CarProps {
  longitude: number;
  latitude: number;
  bearing: number;
}

interface MapDto{
  vehicles :[]
}
const initialViewPoint = {
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 10,
}

const MAPBOX_TOKEN = process.env.REACT_APP_TOKEN;

const MapWrapper = ()=> {

  const[viewpoint,setViewPoint] = React.useState(initialViewPoint);

  const [data,setData] = React.useState(Array<MapDto>());
  React.useEffect(() => {

    const interval = setInterval(async () => {
      //  pull  data after  every 5 seconds 
      setData([]) // set data from the response 
    }, 5000);

    // clean up
    return () => clearInterval(interval);
  }, [data]);

  return (
    <ReactMapGL 
      {...viewpoint}
      mapboxAccessToken={MAPBOX_TOKEN}
      // onViewportChange={setViewPoint}
    >
    <div style={{ position: 'absolute', right: 0 }}>
        <NavigationControl />
    </div>
      <CarMarkers vehicles={[]}/>
    </ReactMapGL>
  )
}

export default MapWrapper

const CarMarkers: React.FC<MapDto> = ({ vehicles }) => {
  return (
   <>
    {
      vehicles.map((r:CarProps)=> <Marker longitude={r.longitude} latitude={r.latitude}>
      <img
        src={car}
        alt="Car icon"
        className="car-icon"
        style={{ transform: `rotate(${r.bearing}deg)` }}
      />
    </Marker>)
    }
   </>
  );
};