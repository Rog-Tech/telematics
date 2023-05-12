import React, { FC, FunctionComponent, useState } from 'react'
import MapWrapper from '../../Components/Map/MapWrapper'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';       
import './Dashboard.css'
import { Divider } from 'primereact/divider'
import axios from 'axios'
import { getFullUrl } from '../../Utils/Helper';
import { Tooltip } from 'primereact/tooltip';
import { CarAlarmProps, CarHistoryProps, CarProps, Fence, ICarInformation } from '../../types/Types'
import { Button } from 'primereact/button'
import { ReverseGeocodingAPIKey, Token } from '../../Utils/constants'
import { Dialog } from 'primereact/dialog';
import GrowlContext from '../../Utils/growlContext'
import styled from 'styled-components'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import battery from '../../assets/battery.svg';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import odometer from '../../assets/odometer.svg'
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Geofence } from './Geofence';
import { extractCars } from '../../Components/Navigation/Routes';
import { useLocation } from 'react-router-dom';
const Content = styled.div<{open:boolean}>`
  padding: 0 2px;
  display:flex;
  justify-content:space-between;
  .MapOptions{
    /* max-width:30vw; */
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    width: 29vw;
    position: absolute;
    z-index: 500;
    background: white;
    border-radius: 9px;
    margin: 5px;
  }
  .modal-button-open{
    background: transparent;
    position: absolute;
    z-index: 500;
    padding: 0px 1px;
    border-radius: 50%;
    /* left: 22.5rem; */
    right: 0;
  }
  .modal-button-closed{
    background: transparent;
    position: absolute;
    z-index: 500;
    padding: 0px 1px;
    border-radius: 50%;
    /* left: 22.5rem; */
    left: 0;
    margin:5px;
  }

  @media (max-width: 768px) {
    .MapOptions{
      /* transform:${({open})=> open ? 'translateX(0)' : 'translateX(100%)'}; */
      transition:transform 0.3s ease-in-out;
      width: 98%;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 50;
      height: fit-content;
      background: white;
      overflow-y:scroll;
      margin-top:15px;
    }
    .modal-button-open{
      padding: 1px 5px;
      right:0;
    }
    .modal-button-closed{
      padding: 1px 5px;
      left:0;
    }
  }
`
export const Loader = styled.div`
    background: transparent;
    position: absolute;
    z-index: 1000;
    right: 0;
    left: 0;
    top: 15rem;
    bottom: 0;
`
const Battery = styled.span`
  p{
    margin-top: -31px;
    margin-right: 13px;
    font-size: 8px;
    font-weight: 700;
  }
`

interface CarDto {
  car:Array<CarProps>
  setSelectedUnit:React.Dispatch<React.SetStateAction<Car | null| undefined>>
}

interface Car {
  name: string;
  code: number;
}


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

export const Dashboard = (props:any) => {
  const usrCtx = JSON.parse( window.localStorage.getItem('refreshToken')!)
  const {token} =  usrCtx;
  const location = useLocation();
  const param = location.state?.carId;
  const alarmParam = location.state?.alarmId;
  const [showTracks,setShowTracks] = React.useState(props.tracks)
  const [showMessages,setMessages] = React.useState(props.msg)
  const [playTrack, setPlay] = React.useState(false);
  const [data,setData] = React.useState(Array<CarProps>());
  const [tracks,setTracks] = React.useState(Array<CarHistoryProps>());
  const [unitId,setUnitId] = React.useState<Car | null>();
  const [time,setTime] = React.useState<number>(20)
  const [speed,setSpeed] = React.useState(500);
  const [isloading, setLoading] = React.useState(false)
  const [alarmId, setAlarmId] = React.useState("")
  const growl = React.useContext(GrowlContext);
  const [directionForward, setDirectionForward] = React.useState(true);
  const newDates = [new Date("01/02/2023"), new Date("09/03/2023")];
  const [dates, setDates] = React.useState<Date[]>(newDates);
  const [mileage, setMileage] = useState(0);
  const [slider, setSlider] = useState(0);
  const [maxSlider, setMaxSlider] = useState(0);
  const [selectedGeofence, setSelectedGeofence] = React.useState<Fence>();
  const [showGeofence, setShowGeofence] = useState(false);

  React.useEffect(() => {
    setLoading(true)
    const interval = setInterval(async () => {
    axios.get(getFullUrl(`/api/v1/gps/cars?token=${token}`)).then((res)=>{
      const  x = res.data as Array<GpsSystem>
      if(x.length < 1 ){
        growl.current.show({
          summary: "No units",
          severity:'info'
        })
        return
      }

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

      const allCars = extractCars(x)
      setData(allCars)
      setLoading(false)

    }).catch((error)=>{
      // console.log(error)
      setLoading(false)
    })
  }, 1500);
   // clean up
    return () => clearInterval(interval);
  }, []);




  // set the first  unit as default unit

  React.useEffect(() => {
    if (data.length > 0) {
      const d : Car[] = data.map((r:CarProps)=>{
        return {
          name:r.machineName, code:r.carId
        }
       })
       setUnitId(d.at(0))
    }
  }, [])

  const getTracks = ()=>{
    setLoading(true)
    if(!dates){
      return
    }
    let carId = unitId?.code
    axios.post(getFullUrl(`/api/v1/gps/carHistory?token=${token}`),{
        carId: carId,
        startTime: dates[0].toISOString().slice(0, 19).replace('T', ' '),
        endTime: dates[1].toISOString().slice(0, 19).replace('T', ' ')
      
    }).then((res)=>{
        const d = res.data as Array<CarHistoryProps>
        if(d.length < 2 && showTracks){
            growl.current.show({
              summary:"No record found for this unit",
              severity:"info"
            })
        }
        const totalMileage = d.reduce((acc:any, curr:any) => {
          if (curr.mileage !== null && curr.mileage !== undefined) {
            return acc + curr.mileage;
          } else {
            return acc;
          }
        }, 0);
        setMileage(totalMileage)
        const s =  d.sort((a, b) => new Date(a.pointDt).getTime() -new Date(b.pointDt).getTime())  
        setTracks(s)
        setLoading(false)
        growl.current.show({
          summary:"Paths loaded successfully",
          severity:'info'
        })
    }).catch((error)=>{
      console.log(error)
    })
  }


  const [manageModal,setModal] =  React.useState(true)

  React.useEffect(()=>{
    setShowTracks(props.tracks)
    setMessages(props.msg)
  },[props])


  React.useEffect(()=>{
    setModal(props.openModal)
  },[props.tracks, props.monitoring, props.openModal])

  return (
    <>
      <Content open={manageModal}>
        {manageModal && (
             <div className="MapOptions">
               <div className='modal-button-open'>
              {manageModal &&(<i onClick={()=>setModal(false)} className="pi pi-times" style={{fontSize:'1rem', color:'red'}}></i>)}
             </div>

             {showTracks &&(<TracksScreen  setPlay={setPlay} setTime={setTime} setSpeed={setSpeed} setDates={setDates}
                     setUnitId={setUnitId} 
                     data={tracks} 
                     units={data} 
                     defaultUnit = {unitId} 
                     setDirectionForward={setDirectionForward}
                     mileage = {mileage}
                     onclick = {getTracks}
                     distance = {slider}
                     maxSlider = {maxSlider}
                     setSlider = {setSlider}
                     />)}
             {showMessages && (<MessageScreen 
                  token={token} units={data}  setUnitId={setUnitId} defaultUnit = {unitId}/>)}

             {props.monitoring && (<MonitorControl  
                  car={data} setSelectedUnit={setUnitId} />)} 

             {props.notifications && (<Notifications   
                  setUnitId={setUnitId} 
                  data = {data} 
                  token={token} 
                  setAlarmId = {setAlarmId}
                  defaultUnit = {unitId} 
                  params = {param}
                  alarmId = {alarmParam}
                  />)}

            {props.geofence && (<Geofence   
                    token={token} 
                    data = {data} 
                  setSelectedGeofence = {setSelectedGeofence}
                  setShowGeofence={setShowGeofence}
            />)}  
            
         </div>
        )}
       <div className='modal-button-closed'>
          {
           !manageModal && (<i  onClick={()=>setModal(true)} className="pi pi-window-maximize" style={{fontSize:'1.5rem', color:'red'}}></i>)
          }
               
        </div>
        <div className="wrapper">
          {isloading &&( <Loader className="flex justify-content-center">
              <ProgressSpinner />
          </Loader>)}
          <MapWrapper 
                playTrack = {playTrack}
                showTracks = {showTracks}
                data = {data}
                tracks = {tracks}
                notifications = {props.notifications}
                messages = {props.showMessages}
                monitoring = {props.monitoring}
                speed={speed}
                time = {time}
                unitId = {unitId}
                alarmId = {alarmId}
                directionForward={directionForward}
                setSlider= {setSlider}
                setMaxSlider = {setMaxSlider}
                currentSliderValue = {slider}
                token = {token}
                geofence = {props.geofence}
                selectedGeofence= {selectedGeofence}
                showGeofence = {showGeofence}
                setShowGeofence = {setShowGeofence}
                setSelectedGeofence= {setSelectedGeofence}
          />
        </div>
      </Content>
    </>
  )
}

const TrackControl = styled.div`
    overflow-y:auto;
    height:14rem;
    padding:15px;
    img{
      height:1.5rem;
    }
    .img-odometer{
      height:1.5rem;
    }
    .img-timer{
      height:1.8rem;
    }
`

const TracksScreen = (props:any) => {
  
  const [selectedCar,setSelectedUnit] = React.useState<Car>(props.defaultUnit);
  const [speed,setSpeed] = React.useState<number>(500);
  const [time,setTime] = React.useState<number>(20)
  const [dropDownOptions,setdropDownOptions] = React.useState(Array<Car>())
  const newDates = [new Date(), new Date()];
  const [dates, setDates] = React.useState<Date[]>(newDates);
  const [status, setstatus] = useState("מושהה")
  const [sliderValue, setSliderValue] = useState<number>();
  const [startTime, setstartTime] = useState("")


  React.useEffect(() => {

    const d : Car[] = props.units.map((r:CarProps)=>{
        return {
          name:r.machineName + "-" + r.remark, code:r.carId
        }
    }) 
    // setstartTime() 
    setdropDownOptions(d)

  }, [props.units])

  const selectButtonOptions: string[] = ['לפני שבעה ימים', 'לפני עשרים יום'];

  const [value, setValue] = React.useState<string>(selectButtonOptions[1]);

  React.useEffect(()=>{
    props.setUnitId(selectedCar)
    props.setSpeed(speed)

  },[selectedCar,time,speed, value])

  React.useEffect(()=>{
    props.setDates(dates)
  },[dates])

  const play = ()=>{
    props.setPlay(false)
    setstatus("מושהה")
  }

  const OnMovementForwardx8 = (speed:number)=>{
    props.setSpeed(speed)
    props.setDirectionForward(true)
    props.setPlay(true)
    setstatus("קדימה x8")
  }
  const OnMovementForwardx16 = (speed:number)=>{

    

    props.setSpeed(speed)
    props.setDirectionForward(true)
    props.setPlay(true)
    setstatus("קדימה x16")
  }
  const OnMovementBackwardx8 = (speed:number)=>{
    props.setSpeed(speed)
    props.setDirectionForward(false)
    props.setPlay(true)
    setstatus("מילות אחור x8")
  }
  const OnMovementBackwardx16 = (speed:number)=>{
    props.setSpeed(speed)
    props.setDirectionForward(false)
    props.setPlay(true)
    setstatus("מילות אחור x16")
  }
  const canSave = dates[0] !== dates[1];

  const OnChange = (e:SliderChangeEvent)=>{
      setSliderValue(e.value as number)
      props.setSlider(e.value as number)
  }
  
  return (
   <>
    <Panel header="מסננים" toggleable className='tracks-panel'>

        <div className='tracks-container'>
              <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setSelectedUnit(e.value)} options={dropDownOptions} optionLabel="name" placeholder="בחר רכב" 
            filter   />
        </div>

        <div className='tracks-container'>
          <label className='tracks-label'>טווח תאריכים</label>
          <Calendar  value={dates} onChange={(e) => setDates(e.value as Array<Date>)} selectionMode="range" readOnlyInput dateFormat="dd/mm/yy" showIcon />
        </div>
        <Button disabled={!canSave} className='filter-button-one' icon="pi pi-search" label='שאילתא' onClick={props.onclick}/>
        
    </Panel>
    <TrackControl className="div">

        <div className='track-control'>
            <div className="flex align-items-center">
            <i className="pi pi-spin pi-cog" style={{ fontSize: '1.2rem' ,color:"#007ad9"}}></i>
                <label htmlFor="Stops" className="ml-2">מפסיק</label>
            </div>
            <div className="flex align-items-center">
             <img src={odometer} className='img-odometer'  alt=''/>
                <label htmlFor="Mileage" className="ml-2">{props.mileage.toFixed(2) + " : מטרים"}</label>
            </div>
        </div>
        <div className='icons-tracks'>
            <Tooltip className='.tracks-icons' />
            <i onClick={()=>OnMovementBackwardx8(1000) } className="pi pi-backward tracks-icons" data-pr-data-pr-tooltip='start unit movement' style={{ color: 'green' }}></i>
            <i onClick={()=>OnMovementBackwardx16(200)} className="pi pi-caret-left tracks-icons" data-pr-data-pr-tooltip='start unit movement' style={{ color: 'green' }}></i>
            <i onClick={play}className="pi pi-pause tracks-icons" data-pr-data-pr-tooltip='stop  unit movement' style={{ color: 'green' }}></i>
            <i onClick={()=>OnMovementForwardx8(200) } className="pi pi-caret-right tracks-icons" data-pr-data-pr-tooltip='start unit movement' style={{ color: 'green' }}></i>
            <i onClick={()=>OnMovementForwardx16(1000) }className="pi pi-fast-forward tracks-icons" data-pr-data-pr-tooltip='stop  unit movement' style={{ color: 'green' }}></i>
        </div>
        <p style={{textAlign:"center"}}>{status}</p>
        <div className="div" style={{display:"flex", marginTop:"1rem"}}>
            <Slider value={sliderValue} 
              onChange={(e: SliderChangeEvent) => OnChange(e)} className="w-full" style={{margin:"auto"}} 
              max={props.maxSlider}
              />
          <InputText value={sliderValue?.toFixed(0) as unknown as string}  className="slider-input" />
        </div>
        {/* <p style={{textAlign:"center"}}>{status}</p> */}
    </TrackControl>
     
     <Divider />
   </>
  )
}
const MessageScreen = (props:any) => {
 
  const [dropDownOptions,setdropDownOptions] = React.useState(Array<Car>());
  const [carInformation,setCarInformation]= React.useState<ICarInformation>(props.carInfo);
  const [selectedCar,setSelectedUnit] = React.useState<Car>(props.defaultUnit);
  const growl = React.useContext(GrowlContext);

  React.useEffect(() => {
    if (selectedCar) {
      axios.get(getFullUrl(`/api/v1/gps/carInfoById?carId=${selectedCar.code}&token=${props.token}`),{
      }).then((res)=>{
        const  x = res.data as ICarInformation
        setCarInformation(x)
  }).catch((error)=>{
    console.log(error)
  })
    }
  }, [selectedCar])

  React.useEffect(() => {
    const d : Car[] = props.units.map((r:CarProps)=>{
        return {
          name:r.machineName +"-" + r.remark, code:r.carId
        }
    })  
    setdropDownOptions(d)
    
  }, [props.units])

  React.useEffect(()=>{
    props.setUnitId(selectedCar)
  },[selectedCar])

    const [nickname, setNickName] = useState(carInformation?.remark)

  React.useEffect(()=>{
    if(carInformation)
      setNickName(carInformation.remark)
  },[carInformation])
    
  const canSave = nickname !== carInformation?.remark;

  const ChangeNickname = ()=>{
    axios.post(getFullUrl(`/api/v1/gps/changeCarName?carId=${selectedCar.code}&nickname=${nickname}&token=${props.token}`)).then(()=>{
      growl.current.show({
        severity:'success',
        summary:  "Device renamed successfully"
      })
    }).catch((error)=>{
      console.log(error)
    })
  }

  return (
   <>
    <div className='tracks-container'>
    <div className='tracks-container'>
          <Dropdown className='tracks-dropdown' value={selectedCar} 
          onChange={(e) => setSelectedUnit(e.value)} options={dropDownOptions} optionLabel="name" placeholder="בחר יחידה" 
        filter   />
    </div>
      
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>כינוי</label>
      <InputText value={nickname}  onChange={(e)=> setNickName(e.target.value)} />
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>imei</label>
      <InputText value= {carInformation?.imei} readOnly />
    </div>
    <div className='tracks-container'>
      <Button disabled={!canSave} label='ערוך כינוי' onClick={ChangeNickname}/>
    </div>
    <Divider />
    <Panel header="מֵידָע" toggleable>
        <p className="m-0 tracks-label">{carInformation?.machineType + " "}:סוג מכונה</p>
        <p className="m-0 tracks-label">{carInformation?.simNO + " "}:סים לא</p>
        <p className="m-0 tracks-label">{carInformation?.carType + " "}:סוג רכב</p>
        <p className="m-0 tracks-label">{carInformation?.serviceState + " "}:מצב שירות</p>
        <p className="m-0 tracks-label">{carInformation?.userId + " "}:זהות המשתמש</p>
    </Panel>
   
   </>
  )
}

const InlineItems = styled.div`
  display:flex;
  justify-content:center;
  i{
    margin: 0 8px;
  }
`
export default Dashboard


const DeviceNamegroup = styled.div`
    flex-flow: column nowrap;
    text-align: center;
`
const MonitorSearchContainer = styled.div`
    overflow-y: scroll;
    width: 29vw;
    height: 72vh;
    @media (max-width: 768px) {
      width: 100%;
      height: 100%;
    }
`
const MonitorControl:FunctionComponent<CarDto> =React.memo(({car,setSelectedUnit}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [serverItems,setServerItems] = React.useState<Array<CarProps>>([])
  const [filteredItems,setFilteredItems] = React.useState<Array<CarProps>>([])
  const [address, setAdress] = React.useState("")


  React.useEffect(()=>{
    setFilteredItems(car)
  },[car]);

 React.useEffect(() => {
  
 }, [])
  

  const handleSelectedUnit = (unitid:number, machinename:string)=>{
        const r: Car = {
          name:machinename, code:unitid
        }

        setSelectedUnit(r)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = filteredItems.filter((item:CarProps) =>
      item.carId.toString().toLowerCase().includes(term.toLowerCase()) 
      || item.remark.toLocaleLowerCase().includes(term.toLocaleLowerCase())
    );
    setFilteredItems(() => filtered);
    // console.log(filtered)
    if (!term) {
        setFilteredItems(car)
    }
  };  

  const ComputeAddress = async (r:CarProps): Promise<string> => {
    try {
      const response = await fetch(
        `https://eu1.locationiq.com/v1/reverse.php?key=${ReverseGeocodingAPIKey}&lat=${r.lat}&lon=${r.lon}&format=json`
        // `https://api.mapbox.com/geocoding/v5/mapbox.places/${r.lon},${r.lat}.json?language=he&access_token=pk.eyJ1IjoiY2hhbm4iLCJhIjoiY2w3OHI1a293MGI4aTNxbzh1dHI5b2owaSJ9.RSbIOzGoHc8JnKvgyIWZ4w`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.log("problem getting address", error);
      return "";
    }
  };
  const OnClick = async (r: CarProps) => {
    
    const address = await ComputeAddress(r);
    confirmDialog({
      message: address,
      header: 'כתובת היחידה',
      icon: 'pi pi-map-marker',
    });
  };
  

  return (
   <div>
    <ConfirmDialog onHide={()=> setAdress("")} footer={null} />
      
    <Tooltip target=".custom-target-icon"  />
    <div className='tracks-container'>
          <InputText className='monitor-search-term' value={searchTerm} onChange={handleSearch}  placeholder='חיפוש מכשיר'/>
    </div>
    <MonitorSearchContainer>
        {
          filteredItems && filteredItems.map((r:CarProps)=> 
              
              <div className='monitor-search-icons' key={r.carId}>
                  <DeviceNamegroup>
                    <p>{r.machineName}</p>
                    <p>{r.remark } : כינוי</p>
                  </DeviceNamegroup>
              
                    <InlineItems>
                    <Tooltip target=".custom-target-icon"  />
                        <i  data-pr-tooltip="לְאַתֵר" onClick={()=>handleSelectedUnit(r.carId,r.machineName)}
                                className="pi pi-map-marker custom-target-icon" style={{ color: '#263af7' }}></i>
                          <i  className="pi pi-home custom-target-icon" style={{ color: '#263af7' }} 
                          onClick={()=>OnClick(r)} data-pr-tooltip="כתובת"></i>
                          <i className="pi pi-info-circle custom-target-icon" 
                              style={{ color: '#263af7' }}  data-pr-tooltip={r.gateType}  ></i>
                          <Battery>
                              <img src={battery} alt="" 
                                  className='custom-target-icon' 
                                    data-pr-tooltip={r.exData} />
                                    <p>{!r.power ? 0 : r.power}%</p>
                          </Battery>
                          {r.online === 0 ? <i data-pr-tooltip={"לא מקוון"} className="pi pi-wifi custom-target-icon" style={{ color: 'red' }}></i>:
                            <i data-pr-tooltip={"באינטרנט"} className="pi pi-wifi custom-target-icon" style={{ color: '#263af7' }}></i>
                          } 
                        
                    </InlineItems>
              </div>
        )}
    </MonitorSearchContainer>
    <Divider />
   </div>
  )
})


const Notifications = (props:any) => {

  const growl = React.useContext(GrowlContext)
  const [alarms,setAlarms] = React.useState(Array<CarAlarmProps>())
  const [dropDownOptions,setdropDownOptions] = React.useState(Array<Car>())
  const [selectedUnit, setSelectedUnit] = React.useState<Car | null>();
  const [selNotification, setSelNotification] = React.useState<Car | null>(props.defaultUnit);
  const [notification,setNotification] = React.useState<CarAlarmProps>()
  const [nickname, setNickName] = useState("")
  const [carID,setCardId] = React.useState<string | null>(props.params);

  React.useEffect(() => {
    const d : Car[] = props.data.map((r:CarProps)=>{
        return {
          name:r.machineName + "-" + r.remark, code:r.carId
        }
    })  
    setdropDownOptions(d)
  }, [props.data])


  React.useEffect(()=>{
    if(carID && props.data){
      const unit :CarProps[]= props.data.filter((c:CarProps)=> c.carId === Number(props.params))
     
      const defaultSelection : Car[]= unit.map((r:CarProps)=>{
        return {
          name:r.machineName, code:r.carId
        }
      })
      setSelNotification(defaultSelection[0])
      // props.setUnitId(defaultSelection[0])
    }
  },[carID,props.data])
  

  React.useEffect(()=>{
    if (selNotification) {
      setSelectedUnit(selNotification);
  
    }

    if (!selectedUnit) {
     return
    }
    // debugger

    props.setUnitId(selectedUnit)
    axios.get(getFullUrl(`/api/v1/gps/alarmsByCar?carId=${selectedUnit.code}&token=${props.token}`)).then((res)=>{
      if(res.data.length <0){
        growl.current.show({
          summary:"No Unread alarms for this unit",
          severity: "success"
        })
      }else{
        const x = res.data as Array<CarAlarmProps>
        // console.log(x)
        // console.log(props.alarmId)
        console.log(props.alarmId)
        if (props.alarmId) {
            setAlarms(x.filter((r)=>r.alarmId  === props.alarmId))
        }else{
          setAlarms(x)
        }

      }
    }).catch(()=>{
      console.log("there's a problem")
    })

  },[selNotification, selectedUnit])



  React.useEffect(()=>{
    props.setUnitId(selectedUnit)
    const nickname : CarProps[] = props.data.filter((r:CarProps)=> r.carId === selectedUnit?.code);
    if (nickname) {
      setNickName(nickname[0]?.remark)
    }
  },[selectedUnit])




  const [show,setShow] = React.useState(false)
  const [phone,setPhone] = React.useState("")

  const handleShowModal =(x:CarAlarmProps)=>{
      setShow(true)
      setNotification(x)
  }

  const canSend = phone !== ""
  const sendNotification = ()=>{
    if (notification === undefined) {
        growl.current.show({
          severity:"error",
          summary: "No notification selected"
        })
        return
    }
    axios.post(getFullUrl('/api/v1/gps/alertWhatsApp'), {
        phone:phone,
        alarmCode: notification.alarmId,
        carName: notification.machineName,
        speed:notification.speed.toString(),
        date: notification.alarmTime
    }, {
      headers: {
        'Authorization': `Basic ${Token}` 
      }
    }).then(()=>{
        growl.current.show({
          severity:"success",
          summary: `Notification sent to ${phone}`
        })
        setShow(false)
    }).catch((error)=>{
      growl.current.show({
        severity:"error",
        summary: `${error}`
      })
    })
  }
     
  const OnClick = async (r: CarAlarmProps) => {
    props.setAlarmId(r.alarmId)

  }; 
  const handleOnChange = (e:DropdownChangeEvent)=>{
    setCardId(null)
    setSelectedUnit(e.value)
  }
  return (
   <>
       <ConfirmDialog  footer={null} />
      <Dialog header="שלח הודעה" visible={show} style={{ width: '35vw' }} onHide={() => setShow(false)} modal={false}>
        <div className="share">
              <label className='labels'>מספר טלפון</label>
              <InputText className='input' value={phone}  onChange={(e)=>setPhone(e.target.value)} placeholder="+ קוד מדינה, למשל"/>
        </div>
        <Button disabled={!canSend} className='button' onClick={sendNotification} icon="pi pi-send" label='לִשְׁלוֹחַ'/>
      </Dialog>
      <Tooltip target=".custom-target-icon"  />
      <div className='monitor-search-icons'>
        <Dropdown value={selectedUnit} onChange={(e: DropdownChangeEvent) => handleOnChange(e)} options={dropDownOptions} optionLabel="name" 
                    placeholder={selectedUnit?.name || selNotification?.name} className="w-full md:w-17rem monitor-search-term" />
      </div>
     <Divider />
     <Tooltip target=".custom-target-icon"  />
      {alarms.length < 1 ? <p style={{textAlign:"center",margin:"10px"}}>אין רשומות עבור יחידה זו</p>
        : <div style={{maxHeight:"28rem", overflowY:"auto"}}>
        {
        alarms.map((x)=>
          <div className='monitor-search-icons' >
        
                 <DeviceNamegroup>
                  <p>{x.machineName}</p> 
                  <p>{nickname}{" "} : כינוי</p> 
                 </DeviceNamegroup>
                  <p>{x.alarmTime}</p>
                  
                <InlineItems>
                  {x.alarDescription}
    
                      <i  data-pr-tooltip="לַחֲלוֹק " onClick={()=>handleShowModal(x)}
                              className="pi pi-share-alt custom-target-icon" style={{ color: '#263af7',marginTop:"5px" }}>
                            
                      </i>
                      <i  data-pr-tooltip="לַחֲלוֹק " onClick={()=>OnClick(x)}
                              className="pi pi-map-marker custom-target-icon" style={{ color: '#263af7',marginTop:"5px" }}>
                            
                      </i>
                </InlineItems>
         </div>
       
      )}
      </div>}
     
   </>
  )
}

const StyledButton = styled.div<{closed:boolean}>`
  border-radius : 20px;
  display:none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: inherit;
    bottom: 0;
    position: fixed;
    margin: 16px 6px;
  }
`
type CloseButtonProps = {
  closed:boolean
}
export const ExitNavBar:FC<CloseButtonProps> = ({closed})=>{
  return (
    <StyledButton closed = {closed}>
      <button>Close</button>
    </StyledButton>
  )
}


