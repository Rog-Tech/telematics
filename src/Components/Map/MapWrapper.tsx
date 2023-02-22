import React, { useCallback, useRef } from 'react'
import Map, { MapRef, Marker, NavigationControl, Popup } from 'react-map-gl';
import Car  from '../../assets/L_9.png'
import 'mapbox-gl/dist/mapbox-gl.css'
import './MapWrapper.css'
import './fonts.css'
import { vehiclesTest } from '../../Utils/Vehicles';
import { Divider } from 'primereact/divider';
import { Tracks } from '../../Screens/Fragments/Tracks';
import { CarProps } from '../../types/Types';
import { MenuItems } from '../../Hooks/menuItems';
import mapboxgl from 'mapbox-gl';
// import { setRTLTextPlugin } from 'mapbox-gl-rtl-text';


const initialViewPoint = {
    latitude: 32.104139,
    longitude: 34.894497,
    zoom: 12,
}

const MAPBOX_TOKEN = process.env.REACT_APP_TOKEN;

const MapWrapper = (props:any)=> {
  const [popupContent,setPopupContent]= React.useState<CarProps|null>();
  const [viewpoint,setViewPoint] = React.useState(initialViewPoint);
  const [data,setData] = React.useState(Array<CarProps>());
  const [cursor,setCursor] = React.useState<string>('pointer');
  const mapRef = useRef<MapRef>(null);
  const [play,setPlay] =  React.useState<boolean>(props.playTrack)
  // handle map clicks: TO DO - use marker event propagation instead

  React.useEffect(()=>{
    setPlay(props.playTrack)
  },[props]) 

  // switch from pan to pointer
  const onMouseEnter = useCallback(()=>setCursor('pointer'),[])
  const onMouseLeave = useCallback(()=>setCursor('auto'),[])
  const onPopupClose = ()=>{
    setPopupContent(null)
  } 

  React.useEffect(()=>{
    // let language:string = "fe"
    // if (mapRef && mapRef.current) {
    //   const map =  mapRef.current.getMap();
    //   map.setLayoutProperty('country-label','text-field',[
    //       'get',
    //       `name_${language}`
    //   ])
    //   // new mapboxgl.setRTLTextPlugin(map)
    //   // map.addControl(new mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js'));
    // }
  },[mapRef]) 
  return (
   <>
    <MenuItems setShowAlerts={props.setShowAlerts} />
    <Map 
      ref={mapRef}
      initialViewState={viewpoint}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{width: "70vw", height: "100vh"}}
      mapStyle='mapbox://styles/chann/clef9nc62000601pgkf94y02a'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      cursor={cursor}
      // localIdeographFontFamily="HebrewFont"
    >
   
    {
      popupContent && (
        <Popup
         longitude={popupContent.lon} 
         latitude={popupContent.lat}
         onClose={onPopupClose}
         offset={[0, -10]} closeOnClick={false}
         >
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
                    <td></td>
                    <td>{" Km"}</td>
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
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
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
    {/* <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} /> */}
    {props.showTracks &&( <Tracks car={vehiclesTest} animation={play}/>)}
    {props.data &&<CarMarkers setPopupContent = {setPopupContent} 
        vehicles={props.data}/>}
    
    {/* {props.notifications && (<CarMarkers setPopupContent = {setPopupContent} 
        vehicles={props.data}/>)}
    {props.messages &&(<CarMarkers setPopupContent = {setPopupContent} 
        vehicles={props.data}/>)}
    {} */}
    </Map>
   </>
  )
}

export default MapWrapper

const CarMarkers = (props:any) => {
  const [content,setContent]= React.useState<CarProps | null>();
  //  TO DO : remove for testing only
  React.useEffect(()=>{
    props.setPopupContent(content)
  },[content])


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
        // props.setPopupContent(r)
        setContent(r)
      }} key={index} longitude={r.lon} latitude={r.lat}>
      <img 
        src={Car}
        alt="Car icon"
        className="car-icon"
        style={{ transform: `rotate(${r.dir}deg)` }}
      />
    </Marker>)
    }
   </>
  );
};