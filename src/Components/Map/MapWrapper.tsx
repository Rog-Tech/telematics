import React, { FunctionComponent, useCallback, useRef, useState } from 'react'
import Map, { MapRef, Marker, NavigationControl, Popup  } from 'react-map-gl';
import Car  from '../../assets/L_9.png'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './MapWrapper.css'
import './fonts.css'
import { Divider } from 'primereact/divider';
import { Tracks } from '../../Screens/Fragments/Tracks';
import { CarAlarmProps, CarHistoryProps, CarProps, Fence, IPopup, OptionsTypes } from '../../types/Types';
import { MenuItems } from '../../Hooks/menuItems';
import styled from 'styled-components';
import satellite from '../../assets/satellite.svg'
import wirelessicon from '../../assets/wirelessicon.svg'
import mapboxgl from "mapbox-gl";
import odometer from '../../assets/odometer.svg'
import stopwatch from '../../assets/stopwatch.svg'
import { ProgressSpinner } from 'primereact/progressspinner';
import battery from '../../assets/battery.svg';
import "mapbox-gl-style-switcher/styles.css";
import { MenuItem } from 'primereact/menuitem';
import { SpeedDial } from 'primereact/speeddial';
import Stops from '../../Screens/Fragments/Stops';
import DrawControl from './drawControl';
import * as turf from '@turf/turf'
import { GeoJSONObject } from '@turf/turf';
import CircleDrawControl from './CircleDrawControl';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';
import { getFullUrl } from '../../Utils/Helper';
import GrowlContext from '../../Utils/growlContext';
import { BufferTypeOptions, ReverseGeocodingAPIKey, SystemOptions } from '../../Utils/constants';
import { PanelHeaderTemplateOptions } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';

// import { setRTLTextPlugin } from 'mapbox-gl-rtl-text';
//  Mapbox bug - https://stackoverflow.com/questions/65434964/mapbox-blank-map-react-map-gl-reactjs
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


const LayerControlDiv = styled.div`
    position:absolute;
    top:165px;
    right:0;
    z-index:49;
    margin:13px;

`
const DrawControlDiv = styled.div`
    position:absolute;
    top:300px;
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
    zoom: 7.5,
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
  alarmId:string;
  notifications:boolean;
}
const MAPBOX_TOKEN = process.env.REACT_APP_TOKEN;

const MapWrapper = (props:any)=> {
  const [isloading, setisloading] = useState(false)
  const [popupContent,setPopupContent]= React.useState<IPopup|null>();
  const [viewpoint,setViewPoint] = React.useState(initialViewPoint);
  const [data,setData] = React.useState(Array<CarProps>());
  const [cursor,setCursor] = React.useState<string>('pointer');
  const mapRef = useRef<MapRef>(null);
  const [play,setPlay] =  React.useState<boolean>(props.playTrack)
  const [mapStyle, setMapStyle] = useState('mapbox://styles/chann/clef9nc62000601pgkf94y02a');
  const [newAlarms,setNewAlarms] = React.useState(Array<CarAlarmProps>())
  const [nortAid, setnortAid] = useState<string | null>()
  const [features, setFeatures] = React.useState<GeoJSONObject>();
  const [buffer, setbuffer] = useState<GeoJSONObject | undefined>()

  const [lineBufferDistance, setlineBufferDistance] = useState<GeoJSONObject>()
  // const [showGeofence, setshowGeofence] = useState(false)
  const [bufferDistance, setbufferDistance] = useState<number | null>(null);

  React.useEffect(()=>{
    setPlay(props.playTrack)
    setData(data)
    setnortAid(props.alarmId)

    if (!props.notifications) {
      setnortAid(null)
    }
  },[props]) 

  // switch from pan to pointer
  const onMouseEnter = useCallback(()=>setCursor('pointer'),[])
  const onMouseLeave = useCallback(()=>setCursor('auto'),[])
  const onPopupClose = ()=>{
    setPopupContent(null)
  } 

  const FitView = (k: Car, props: Props) => {
    const { data, showTracks, tracks, messages} = props;
    const map = mapRef.current?.getMap?.();
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
        if(nortAid && newAlarms.length > 1){
          const alarm = newAlarms.filter((t: CarAlarmProps) => t.alarmId === nortAid);
          map.flyTo({ center: [alarm[0].lon, alarm[0].lat], zoom: 20 });
        }else{
          const carData = data.filter((t: CarProps) => t.carId === k.code);
          map.flyTo({ center: [carData[0].lon, carData[0].lat], zoom: 15 });
        }
     
    }else{

    }
    
  };
  
  React.useEffect(() => {
    if (props.unitId) {
      FitView(props.unitId, props);
    } 
  }, [props.unitId, props.tracks, nortAid]);


  // TO DO
    
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

     //  create fence 
  const handleBufferRadiusChange = (newValue: number) => {
    setbufferDistance(newValue);
  };

   const onUpdate = useCallback((e:any) => {
    props.setShowGeofence(true)
    
    let  r = e.features
    if (r) {
      var  feature = r.at(0)
      setFeatures(feature)
    }
  }, []);

  const onDelete = useCallback((e:any) => {
    if (e.features) {
      delete e.features
    }
  }, []);


  const handleOnHide = ()=>{
    setbuffer(undefined)
    props.setShowGeofence(false)
    props.setSelectedGeofence(undefined)

  }



  const [hideModalContent, sethideModalContent] = useState(true)

  const headerTemplate = ()=>{
  return (
    <>
    <span>
      {hideModalContent ? <i onClick={()=> sethideModalContent(false)} className="pi pi-angle-up" style={{ color: 'blue' , fontSize:"1.2rem"}}></i> :
        <i onClick={()=>sethideModalContent(true)} className="pi pi-angle-down" style={{ color: 'blue',fontSize:"1.2rem" }}></i>
      }
    </span>
    <p>Geofence Manager</p>
    </>
  )
  }

  return (
   <>
   {isloading&&(<ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />)}
    <MenuItems setShowAlerts={props.setShowAlerts} notifications={props.notifications} selectedUnit= {props.unitId} setNewAlarms={setNewAlarms}/>
    
    <Dialog position='bottom' header={headerTemplate} visible={props.showGeofence} style={{ width: '23vw'}} onHide={handleOnHide} modal={false} >
      {hideModalContent && (<GeofenceManager setBufferRadius={handleBufferRadiusChange}
        feature={features} token={props.token}
          mapRef={mapRef} setBuffer={setbuffer} 
          setlineBufferDistance={setlineBufferDistance} 
          mapActions={false} 
          Geofence={props.selectedGeofence}
          setGeofenceId={props.setGeofenceId}
          />)}
    </Dialog>

    <Map 
      ref={mapRef}
      initialViewState={viewpoint}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{width: "100vw", height: "100vh"}}
      mapStyle={mapStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      cursor={cursor}
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
                  {
                    props.showTracks ? <>
                        <p>{popupContent.pointDt}  :זמן עצירה </p>
                    </> : 
                    <>
                      <p>{popupContent.machineName}</p>
                      <PopupBattery>
                      <img src={battery} alt="" 
                          className='popup-target-icon' 
                            data-pr-tooltip={popupContent.exData} />
                            <p>{!popupContent.power ? 0 : popupContent.power}%</p>
                    </PopupBattery>
                    </>
                  }
                  
              </div>
              <Divider />
              <div className="popup-content">
                  <i className="pi  pi-map-marker" style={{ color: '#2c3ff7'}}></i>
                  <p>{popupContent.address}</p>
              </div>
              <Divider />
              { props.showTracks &&(
                <>
                   <div className="popup-content">
                       <i className="pi  pi-stopwatch" style={{ color: 'red'}}></i>
                       <p>{(popupContent.stopTime/60).toFixed(2) + " " + "דקות"}</p>
                    </div> 
                    {/* <Divider /> */}
                    {/* <div className="popup-content">
                        <i className="pi  pi-clock" style={{ color: '#2c3ff7'}}></i>
                        <p>{popupContent.alarmTime}</p>
                    </div>  */}
                </>
              )}

              {nortAid &&( <>
                    <div className="popup-content">
                       <i className="pi  pi-bell" style={{ color: 'red'}}></i>
                       <p>{popupContent.alarDescription}</p>
                    </div> 
                    <Divider />
                    <div className="popup-content">
                        <i className="pi  pi-clock" style={{ color: '#2c3ff7'}}></i>
                        <p>{popupContent.alarmTime}</p>
                    </div> 
                    
                  </>)}
               {!props.showTracks && !nortAid &&(
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
               )}
              <Divider />
           </div>
        </Popup>
      )
    }
    <div style={{ position: 'absolute', right: 0 }}>
        <NavigationControl />
    </div>
    {props.showTracks &&( 
      props.tracks &&(<>
      
      <Tracks car={props.tracks} 
              animation={play} speed={props.speed} 
              time={props.time} 
              setPopupContent={setPopupContent} 
              direction={props.directionForward} 
              setSlider={props.setSlider} 
              setMaxSlider={props.setMaxSlider}
              slider = {props.currentSliderValue}
              />
      <Stops carUnits={props.tracks} setPopupContent = {setPopupContent} />
      
        </>))
    }
    {props.data && !props.showTracks &&(<CarMarkers setPopupContent = {setPopupContent} 
        vehicles={props.data} notifications={props.notifications} alarms={newAlarms} nortId = {nortAid}/>)}
        
    {buffer && (<CircleDrawControl circle={buffer} line={lineBufferDistance} />)}
      {props.geofence && (
            <DrawControlDiv>
            <DrawControl
                    position="top-right"
                    displayControlsDefault={false}
                    controls={{
                      point: true,
                      trash:true
                    }}
                    onCreate={onUpdate}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
            />
        </DrawControlDiv>
      )}
    <LayerControlDiv>
      <SpeedDial showIcon='pi pi-map' model={items} direction="down" style={{ left: 'calc(50% - 2rem)', top: 0 }} />
    </LayerControlDiv>
    </Map>
   </>
  )
}

export default MapWrapper

const CarMarkers = (props:any) => {

  const [content,setContent]= React.useState<IPopup | null>();

  React.useEffect(()=>{
    if(!content){
      return
    }
    async function fetchData() {
      try {
        const response = await fetch(
          `https://eu1.locationiq.com/v1/reverse.php?key=${ReverseGeocodingAPIKey}&lat=${content?.lat}&lon=${content?.lon}&format=json`
          // `https://api.mapbox.com/geocoding/v5/mapbox.places/${content?.lon},${content?.lat}.json?language=he&access_token=pk.eyJ1IjoiY2hhbm4iLCJhIjoiY2w3OHI1a293MGI4aTNxbzh1dHI5b2owaSJ9.RSbIOzGoHc8JnKvgyIWZ4w`
        );
        const data = await response.json();
        const r = {
          address: data.display_name,
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
          power:content?.power,
          alarDescription:content?.alarDescription,
          alarmTime:content?.alarmTime
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

      { props.vehicles.map((r:IPopup, index: React.Key)=>
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

        {props.nortId &&(
          <>
            {props.alarms.map((r:IPopup, index: React.Key)=>
           <Marker 
           
             onClick={e => {
             e.originalEvent.stopPropagation();
             setContent(r)
           }} key={index} longitude={r.lon} latitude={r.lat}>
           <img 

             src={Car}
             alt="Car icon"
             className={props.nortId === r.alarmId ? "car-icon selected-marker" : "car-icon"}
             style={{ transform: `rotate(${r.dir}deg)` }}
            
           />
         </Marker>)}
          </>
        )
        }  
    </>
  )
}

interface GeoFenceManagerProps {
  feature : any;
  setBufferRadius : (newValue: number) => void;
  mapRef : React.RefObject<MapRef>
  setBuffer : React.Dispatch<React.SetStateAction<GeoJSONObject | undefined>>
  setlineBufferDistance : React.Dispatch<React.SetStateAction<GeoJSONObject | undefined>>
  token:string;
  mapActions : boolean;
  Geofence : Fence
  setGeofenceId :React.Dispatch<React.SetStateAction<{} | undefined>>
}
const GoefenceManagerContainer = styled.div`
      font-size:13px;
      font-weight: 400;
    .input-group{
      display:flex;
      margin:10px;
      text-align:center;
      justify-content:end;
      font-size:13px;
      font-weight: 400;
      input{
        margin-left:15px;
        border-radius:10px;
        font-weight: 400;
         font-size:13px;
      }
      label{
        text-transform:capitalize;
        margin:auto;
      }
      button{
        border-radius:24px;
        margin-left: 15px;
        margin-top: 15px;
      }
      .check-input{
        margin-left:10px;
      }
    }
`

const GeofenceManager : FunctionComponent<GeoFenceManagerProps> =({feature,mapRef,setBuffer,setlineBufferDistance,token,Geofence,setGeofenceId})=>{

  const [outSwitch, setoutSwitch] = useState<boolean>(true);
  const [inSwitch, setinSwitch] = useState<boolean>(true);
  const [pushSubFlag, setPushSubFlag] = useState<boolean>(true);
  const [fenceType, setFenceType] = useState("ONLY_USER")
  const [fenceName, setFenceName] = useState("")
  const [circleRadius, setCircleRadius] = useState(0)
  const [points, setPoints] = useState<[number,number][]>();
  const growl = React.useContext(GrowlContext)
  const [systemType,setSystemType] = React.useState<OptionsTypes>();
  const [bufferType,setBufferType] = React.useState<OptionsTypes>();
  const [editMode, setEditMode] = useState(false);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value)
    // setBufferRadius(Number(event.target.value));
    setCircleRadius(Number(event.target.value))
  };
  const canApplyChanges =  circleRadius !==0 
  const canSave = fenceName !=="" &&  circleRadius !==0 && systemType !== undefined && bufferType !== undefined
  const applyChanges = ()=>{
      if (feature) {
        setPoints(feature.geometry.coordinates)
        const map = mapRef.current?.getMap?.();
        const circle = turf.buffer(feature, circleRadius*0.000621371, {units: 'miles'});
        const angle = (Date.now() / 1000) % 360;
        const buffered = turf.transformRotate(circle, angle, { pivot: feature });
        const point = turf.pointOnFeature(feature);
        const bounds = turf.bbox(buffered);
        const line = turf.lineString([feature.geometry.coordinates, point.geometry.coordinates]);
        const lngLatBounds = new mapboxgl.LngLatBounds(
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]]
        );

        map?.fitBounds(lngLatBounds, { padding: 50 });
        setBuffer(buffered)
        setlineBufferDistance(line) 
      }
  }
  //  To Do migrate compute buffer to one function.
  const saveGeofence = ()=>{
    axios.post(getFullUrl(`/api/v1/gps/addFence?token=${token}`),{
      system: systemType,
      type: bufferType,
      name: fenceName,
      points: [points],
      radius: circleRadius,
      inSwitch: inSwitch,
      outSwitch: outSwitch,
      fenceType: fenceType,
      pushSubFlag: pushSubFlag
    }).then((res)=>{
      console.log(res.data)
      setGeofenceId(res.data)
      growl.current.show({
        severity:"success",
        summary:"Geo fence created successfully"
      })
    }).catch(()=>{
      growl.current.show({
        severity:"error",
        summary:"Unable to  save geo fence"
      })
    })
  }

  React.useEffect(()=>{
    if(Geofence){
      setEditMode(true)
      const map = mapRef.current?.getMap?.();
      setinSwitch(Geofence.inSwitch)
      setFenceName(Geofence.name)
      setCircleRadius(Geofence.radius)
      setPushSubFlag(Geofence.pushSubFlag)
      setoutSwitch(Geofence.outSwitch)
      var p = Geofence.points[0] as unknown as  Array <string>
      var point = turf.point([Number(p[0]), Number(p[1])]);
      var buffered = turf.buffer(point, Geofence.radius*0.000621371, {units: 'miles'});
      setBuffer(buffered)
      const bounds = turf.bbox(buffered);
      const lngLatBounds = new mapboxgl.LngLatBounds(
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]]
      );

      map?.fitBounds(lngLatBounds, { padding: 20 });
    }
  },[Geofence])


  const saveEdits = ()=>{

      if (Geofence) {
        axios.post(getFullUrl(`/api/v1/gps/editFence?token=${token}`),{
          carFenceId: Geofence.carFenceId,
          radius: circleRadius,
          type: "CIRCLE",
          name: fenceName,
          inSwitch: inSwitch,
          outSwitch: outSwitch,
          fenceType: fenceType,
          pushSubFlag: pushSubFlag
        }).then(()=>{
            growl.current.show({
              severity:"success",
              summary:'Fence has been updated'  
            })
        }).catch(()=>{
          growl.current.show({
            severity:"error",
            summary:"Could not update the data"  
          })
        })
      }
  } 

  return(
    <GoefenceManagerContainer>
      <div className="input-group">
        <label htmlFor="labels">system</label>
        {/* <InputText id="labels" aria-describedby="labels-help" value='WHATSGPS'/> */}
        <Dropdown disabled={editMode}  value={systemType}  className="w-full md:w-12rem" style={{marginLeft:"15px", borderRadius:"10px"}}
          onChange={(e) => setSystemType(e.value)} options={SystemOptions} 
            optionLabel="name" placeholder="מערכת" 
               /> 
      </div>
      <div className="input-group">
        <label htmlFor="labels">type</label>
        {/* <InputText id="labels" aria-describedby="labels-help" value='CIRCLE'/> */}
        <Dropdown disabled={editMode} value={bufferType}  className="w-full md:w-12rem" style={{marginLeft:"15px", borderRadius:"10px"}}
          onChange={(e) => setBufferType(e.value)} options={BufferTypeOptions} 
            optionLabel="name" placeholder="סוּג" 
               />
      </div>
      <div className="input-group">
        <label htmlFor="labels">name</label>
        <InputText id="labels" aria-describedby="labels-help" value= {fenceName} onChange={(e)=>setFenceName(e.target.value)} />
      </div>
      <div className="input-group">
        <label htmlFor="labels">Radius(Meters)</label>
        <InputText  id="labels" aria-describedby="labels-help" value={circleRadius as unknown as string} onChange= {(handleChange)} />
      </div>
      <div className="input-group">
        <label htmlFor="labels">inSwitch</label>
        <Checkbox className='check-input' onChange={e => setinSwitch(e.checked as boolean)} checked={inSwitch}></Checkbox>
      </div>
      <div className="input-group">
        <label htmlFor="labels">outSwitch</label>
        <Checkbox className='check-input' onChange={e => setoutSwitch(e.checked as boolean)} checked={outSwitch}></Checkbox>
      </div>
      <div className="input-group">
        <label htmlFor="labels">fenceType</label>
        <InputText id="labels" aria-describedby="labels-help" value={fenceType} onChange={(e)=>setFenceType(e.target.value)}/>
      </div>
      <div className="input-group">
        <label htmlFor="username">pushSubFlag</label>
        <Checkbox className='check-input' onChange={e => setPushSubFlag(e.checked as boolean)} checked={pushSubFlag}></Checkbox>
      </div>
      <div className="input-group">
          
          {Geofence ? <Button  label='Save Edits' onClick={saveEdits} /> :<Button disabled={!canSave} label='Save' onClick={saveGeofence} /> }
         {!Geofence &&( <Button disabled= {!canApplyChanges} label='Apply' onClick={applyChanges}/>)}
      </div>
    </GoefenceManagerContainer>
  )
}