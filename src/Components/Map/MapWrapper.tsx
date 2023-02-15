import axios from 'axios';
import React, { FC, useCallback, useRef } from 'react'
import Map, { MapRef, Marker, NavigationControl, Popup } from 'react-map-gl';
import { basicAuth } from '../../Utils/constants';
import { getFullUrl } from '../../Utils/Helper';
import Car  from '../../assets/L_9.png'
import 'mapbox-gl/dist/mapbox-gl.css'
import './MapWrapper.css'
import { vehiclesTest } from '../../Utils/Vehicles';
import { Divider } from 'primereact/divider';

// To Do : move to types
interface CarProps {
    accStatus: number,
    accTime: number,
    carId: number,
    dir: number,
    exData:string,
    gateType: string,
    heartTime:number,
    lat:number,
    latc: number,
    lon:number,
    lonc: number,
    machineType: number,
    online: number,
    orginalSpeed: number,
    pointTime: number,
    pointType: number,
    speed: number,
    staticTime: number,
    status: string
}

type PopupProperties ={
  longitude:number,
  latitude:number,
  layerID:string,
  feature:Array<{}>
  recordId:number
}
interface MapDto{
  vehicles :Array<CarProps>
}
const initialViewPoint = {
    latitude: 32.045471,
    longitude: 34.766709,
    zoom: 8,
}

const MAPBOX_TOKEN = process.env.REACT_APP_TOKEN;

const MapWrapper = ()=> {
  const [popupContent,setPopupContent]= React.useState<CarProps>();
  const [viewpoint,setViewPoint] = React.useState(initialViewPoint);
  const [data,setData] = React.useState(Array<CarProps>());
  const [cursor,setCursor] = React.useState<string>('pointer');
  const mapRef = useRef<MapRef>(null);

  // handle map clicks: TO DO - use marker event propagation instead
  const handleMapClick = useCallback((event:any) => {
    const feature = event.features && event.features[0];
    if (feature) {
      console.log(feature)
      const keys = Object.keys(feature.properties)
      console.log(keys)
      // setObjectkeys(keys)
      const c = keys.map((x,index)=>{
        return {
          [keys[index]]: feature.properties[x]
        }
      })
      console.log(c)
      // setFeatureAttributes(c)
      
    }
  }, []);

  
  React.useEffect(() => {
    const interval = setInterval(async () => {
      setData(vehiclesTest)
    //  axios.get(getFullUrl('/api/v1/gps/cars'), {
    //     auth: {
    //       username: 'test',
    //       password: 'password'
    //     }
    //   })
    //     .then(response => {
    //       const d =  response.data as Array<CarProps>
    //       console.log(d)
    //       setData(d)
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
      //  pull  data after  every 5 seconds 
       // set data from the response 
    }, 5000);

    // clean up
    return () => clearInterval(interval);
  }, []);

  // get interactive layer ids

  React.useEffect(()=>{
    if(mapRef && mapRef.current){
      const map = mapRef.current.getMap();
      const lyrs = map.getStyle().layers
      // console.log(lyrs)
    }
    console.log(popupContent)
  },[])
  // switch from pan to pointer
  const onMouseEnter = useCallback(()=>setCursor('pointer'),[])
  const onMouseLeave = useCallback(()=>setCursor('auto'),[])
  return (
    <Map 
      ref={mapRef}
      initialViewState={viewpoint}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{width: "100vw", height: "100vh"}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      cursor={cursor}
    >
    {data &&(<CarMarkers setPopupContent = {setPopupContent} vehicles={data}/>)}
    {
      popupContent && (
        <Popup longitude={popupContent.lon} latitude={popupContent.lat}>
           <div className='popup-container'>
              <div className="popup-header">
                  <img 
                    src={Car}
                    alt="Car icon"
                  />
                  <p>{popupContent.exData}</p>
              </div>
              <Divider />
              <div className="popup-content">
                  <img 
                    src={Car}
                    alt="Car icon"
                  />
                  <p>{popupContent.exData}</p>
              </div>
              <Divider />
              <div>
                <table style={{width:"100%"}}>
                  <tr>
                    <td>{popupContent.accStatus}</td>
                    <td>{popupContent.orginalSpeed}{" Km"}</td>
                    <td>{"Lat : " + popupContent.lat + " Long: " +  popupContent.lon}</td>
                  </tr>
                </table>
              </div>
              <div>
                <table style={{width:"100%"}}>
                    <tr>
                      <th>Sensor values:</th>
                    </tr>
                      <tr>
                    <td>{popupContent.accStatus}</td>
                    <td>{popupContent.orginalSpeed}</td>
                    <td>{popupContent.online}</td>
                  </tr>
                </table>
              </div>
              <Divider />
           </div>
        </Popup>
      )
    }
    <div style={{ position: 'absolute', right: 0 }}>
        <NavigationControl />
    </div>
     
    </Map>
  )
}

export default MapWrapper

const CarMarkers = (props:any) => {
  return (
   <>
    {
     props.vehicles.map((r:CarProps, index: React.Key)=>
      <Marker 
        onClick={e => {
        // If we let the click event propagates to the map,
        //  it will immediately close the popup
        // with `closeOnClick: true`
        e.originalEvent.stopPropagation();
        props.setPopupContent(r)
        // console.log(r);
      }} key={index} longitude={r.lon} latitude={r.lat}>
      <img 
        src={Car}
        alt="Car icon"
        className="car-icon"
        style={{ transform: `rotate(${0}deg)` }}
      />
    </Marker>)
    }
   </>
  );
};