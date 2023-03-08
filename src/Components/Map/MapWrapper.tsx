import React, { useCallback, useRef, useState } from 'react'
import Map, { MapboxGeoJSONFeature, MapRef, Marker, NavigationControl, Popup } from 'react-map-gl';
import Car  from '../../assets/L_9.png'
import 'mapbox-gl/dist/mapbox-gl.css'
import './MapWrapper.css'
import './fonts.css'
import { Divider } from 'primereact/divider';
import { Tracks } from '../../Screens/Fragments/Tracks';
import { CarHistoryProps, CarProps, IPopupContent } from '../../types/Types';
import { MenuItems } from '../../Hooks/menuItems';
import styled from 'styled-components';
import satellite from '../../assets/satellite.svg'
import wirelessicon from '../../assets/wirelessicon.svg'
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import odometer from '../../assets/odometer.svg'
import stopwatch from '../../assets/stopwatch.svg'
import { ProgressSpinner } from 'primereact/progressspinner';
import battery from '../../assets/battery.svg';
import GrowlContext from '../../Utils/growlContext';
import {MapboxStyleSwitcherControl,MapboxStyleDefinition} from 'mapbox-gl-style-switcher';
import "mapbox-gl-style-switcher/styles.css";
import  LayerControl  from 'react-map-gl';
import { MenuItem } from 'primereact/menuitem';
import { SpeedDial } from 'primereact/speeddial';

// import { setRTLTextPlugin } from 'mapbox-gl-rtl-text';
//  Mapbox bug - https://stackoverflow.com/questions/65434964/mapbox-blank-map-react-map-gl-reactjs
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


const LayerControlDiv = styled.div`
    position:absolute;
    top:100px;
    right:0;
    z-index:49;
    margin:13px;

`
const PopupItemContainer = styled.div`
  span{
    display: flex;
    justify-content:space-between;

    p{
      margin-left:5px;
      color: #2c3ff7;
      font-size: 11px;
      font-weight:700;
      text-transform:capitalize;
    }
  }
  img{
    height:1.3rem;
  }
  .span-items{
    display:flex;
    justify-content:space-between;
    margin-bottom:10px;
  }
`

const initialViewPoint = {
    latitude: 31.33119,
    longitude: 34.918909,
    zoom: 12,
}
interface Car {
  name: number;
  code: number;
}
const PopupBattery = styled.span`
  p{
    margin-top: -35px;
    margin-right: 14px;
    font-size: 8px;
    font-weight: 700;
  }
`
interface Props {
  unitId: Car;
  data: CarProps[];
  showTracks: boolean;
  tracks: CarHistoryProps[];
  messages: string[];
}
const MAPBOX_TOKEN = process.env.REACT_APP_TOKEN;

const MapWrapper = (props:any)=> {
  const [isloading, setisloading] = useState(false)
  const [popupContent,setPopupContent]= React.useState<IPopupContent|null>();
  const [viewpoint,setViewPoint] = React.useState(initialViewPoint);
  const [data,setData] = React.useState(Array<CarProps>());
  const [cursor,setCursor] = React.useState<string>('pointer');
  const mapRef = useRef<MapRef>(null);
  const [play,setPlay] =  React.useState<boolean>(props.playTrack)
  const growl = React.useContext(GrowlContext);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/chann/clef9nc62000601pgkf94y02a');
  // handle map clicks: TO DO - use marker event propagation instead

  React.useEffect(()=>{
    setPlay(props.playTrack)
    setData(data)
  },[props]) 

  // switch from pan to pointer
  const onMouseEnter = useCallback(()=>setCursor('pointer'),[])
  const onMouseLeave = useCallback(()=>setCursor('auto'),[])
  const onPopupClose = ()=>{
    setPopupContent(null)
  } 
  const flyToOptions = {
    center: undefined,
    zoom: 19,
  };


  const FitView = (k: Car, props: Props) => {
    const { unitId, data, showTracks, tracks, messages } = props;
    const map = mapRef.current?.getMap?.();
    const layer = map?.getLayer("car-path");
    const mapBounds = map?.getBounds?.();
    
    if (!map || !k) {
      console.log("No map or car selected");
      return;
    }
    
    if (showTracks && tracks.length > 1) {
      const firstTrack = tracks.at(0);
      if (firstTrack) {
        map.flyTo({ center: [firstTrack.lon, firstTrack.lat], zoom: 12 });
      }
    } else if (!showTracks && !messages && data.length > 1 ) {
      const carData = data.filter((t: CarProps) => t.carId === k.code);
      map.flyTo({ center: [carData[0].lon, carData[0].lat], zoom: 15 });
    } else {
    }
  };
  
  React.useEffect(() => {
    if (props.unitId) {
      FitView(props.unitId, props);
    } 
  }, [props.unitId, props.tracks]); // reload with the image when


  
  const styles: MapboxStyleDefinition[] = [
    {
        title: "Satelite",
        uri:"mapbox://styles/chann/ckhlsly700les19pbrd0holga"
    },
    {
        title: "Light",
        uri:"'mapbox://styles/chann/clef9nc62000601pgkf94y02a'"
    }
  ];
    
  const items: MenuItem[] = [
    {
        label: 'Labels',
        style:{color:"grey"},
        icon: 'pi pi-map',
        command: () => {
          onMapStyleChange("mapbox://styles/chann/clef9nc62000601pgkf94y02a")
        }
    },
    {
        label: 'Update',
        icon:<img src={satellite} alt='' style={{height:"1.2rem"}} />,
        command: () => {
          onMapStyleChange("mapbox://styles/chann/ckhlsly700les19pbrd0holga")
        }
    }]
   const onMapStyleChange = (style: string) => {
      setMapStyle(style);
    };
  return (
   <>
   {isloading&&(<ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />)}
    <MenuItems setShowAlerts={props.setShowAlerts} notifications={props.notifications} selectedUnit= {props.unitId}/>
      
    <Map 
      ref={mapRef}
      initialViewState={viewpoint}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{width: "100vw", height: "100vh"}}
      mapStyle={mapStyle}
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
                  <p>{popupContent.machineName}</p>
                  <PopupBattery>
                  <img src={battery} alt="" 
                      className='popup-target-icon' 
                        data-pr-tooltip={popupContent.exData} />
                        <p>{!popupContent.power ? 0 : popupContent.power}%</p>
                 </PopupBattery>
              </div>
              <Divider />
              <div className="popup-content">
                  <i className="pi  pi-map-marker" style={{ color: '#2c3ff7',margin:"auto" }}></i>
                  <p>{popupContent.address}</p>
              </div>
              <Divider />
           
              <PopupItemContainer>
                <div className='span-items'>
                  <span>
                    <img src={satellite} alt='' />
                    <p>{popupContent.gpsUpdateTime}</p>
                  </span>
                  <span>
                    <img src={wirelessicon} alt='' />
                    <p>Wireless</p>
                  </span>
                </div>
                <div className='span-items'>
                  <span>
                    <img src={stopwatch} alt='' />
                    <p>{popupContent.gsmUpdateTime}</p>
                  </span>
                  <span>
                    <img src={odometer} alt='' />
                    <p>0.0{" "}KMS</p>
                  </span>
                </div>
              </PopupItemContainer>
              <Divider />
           </div>
        </Popup>
      )
    }
    <div style={{ position: 'absolute', right: 0 }}>
        <NavigationControl />
    </div>
    {props.showTracks &&( 
      props.tracks &&(<Tracks car={props.tracks} animation={play} speed={props.speed} time={props.time} setPopupContent = {setPopupContent}/>))
    }
    {props.data && !props.showTracks &&(<CarMarkers setPopupContent = {setPopupContent} 
        vehicles={props.data}/>)}
    <LayerControlDiv>
      <SpeedDial showIcon='pi pi-map' model={items} direction="down" style={{ left: 'calc(50% - 2rem)', top: 0 }} />
    </LayerControlDiv>
    </Map>
   </>
  )
}

export default MapWrapper

const CarMarkers = (props:any) => {

  const [content,setContent]= React.useState<CarProps | null>();

  React.useEffect(()=>{
    if(!content){
      return
    }
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${content?.lon},${content?.lat}.json?language=he&access_token=pk.eyJ1IjoiY2hhbm4iLCJhIjoiY2w3OHI1a293MGI4aTNxbzh1dHI5b2owaSJ9.RSbIOzGoHc8JnKvgyIWZ4w`
        );
        const data = await response.json();
        const r = {
          address: data.features[0].place_name_he,
          dir: content?.dir,
          exData: content?.exData,
          lat: content?.lat,
          latc: content?.latc,
          lon: content?.lon,
          lonc: content?.lonc,
          speed: content?.speed,
          status: content?.status,
          carId: content?.carId,
          gpsUpdateTime: content?.gpsUpdateTime,
          gsmUpdateTime:content?.gsmUpdateTime,
          machineName:content?.machineName,
          power:content?.power

        }
        props.setPopupContent(r)
      } catch (error) {
        
      }
    }

    fetchData();
    props.setPopupContent(content)
  },[content])

  return (
   <>
    {
     props.vehicles.map((r:CarProps, index: React.Key)=>
      <Marker 
        onClick={e => {
        e.originalEvent.stopPropagation();
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

interface MapControlProps {
  styleSwitcher: MapboxStyleSwitcherControl;
  map:MapRef
}

