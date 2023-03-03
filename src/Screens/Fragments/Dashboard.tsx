import React, { FC, FunctionComponent } from 'react'
import MapWrapper from '../../Components/Map/MapWrapper'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';       
import './Dashboard.css'
import { Divider } from 'primereact/divider'
import { Checkbox } from "primereact/checkbox";
import axios from 'axios'
import { getFullUrl } from '../../Utils/Helper';
import carSmall from '../../assets/carSmall.png'
import batteryStatus from '../../assets/batteryStatus.svg'
import { Tooltip } from 'primereact/tooltip';
import { CarAlarmProps, CarHistoryProps, CarProps, ICarInformation, SearchParamsDto } from '../../types/Types'
import { Button } from 'primereact/button'
import { Token } from '../../Utils/constants'
import { Dialog } from 'primereact/dialog';
import GrowlContext from '../../Utils/growlContext'
import styled from 'styled-components'
import { SpeedDial } from 'primereact/speeddial'
import { MenuItem } from 'primereact/menuitem'
import { SelectButton } from 'primereact/selectbutton';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import battery from '../../assets/battery.svg';
import { ProgressSpinner } from 'primereact/progressspinner';
const Content = styled.div<{open:boolean}>`
  padding: 0 2px;
  display:flex;
  justify-content:space-between;
  .MapOptions{
    /* max-width:30vw; */
    width:fit-content;
    height:100vh;
    width:25vw;
  }
  .modal-button{
    position:absolute;
    z-index:1000;
    bottom:0
  }

  @media (max-width: 768px) {
    .MapOptions{
      transform:${({open})=> open ? 'translateX(0)' : 'translateX(100%)'};
      transition:transform 0.3s ease-in-out;
      width: 100%;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 50;
      height: fit-content;
      background: #f1f1f1;
      overflow-y:scroll
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
  setSelectedUnit:React.Dispatch<React.SetStateAction<Car | null>>
}

interface DateTimeFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZoneName?: 'short' | 'long';
  hour12?: boolean;
  timeZone?: string;
}

export const Dashboard = (props:any) => {
  const[showTracks,setShowTracks] = React.useState(props.tracks)
  const[showMessages,setMessages] = React.useState(props.msg)
  const [playTrack, setPlay] = React.useState(false);
  const [data,setData] = React.useState(Array<CarProps>());
  const [tracks,setTracks] = React.useState(Array<CarHistoryProps>());
  const [carInfo,setCarInfo] = React.useState<ICarInformation>();
  const [unitId,setUnitId] = React.useState<Car | null>({name:1356089, code:1356089});
  const [time,setTime] = React.useState<number>(20)
  const [speed,setSpeed] = React.useState("1");
  const [isloading, setisloading] = React.useState(false)
  const usrCtx = JSON.parse( window.localStorage.getItem('refreshToken')!)
  const {name,token} =  usrCtx;
  const growl = React.useContext(GrowlContext);

  console.log(props)

  React.useEffect(() => {
    setisloading(true)
    const interval = setInterval(async () => {
      axios.get(getFullUrl(`/api/v1/gps/cars?token=${token}`)).then((res)=>{
        const  x = res.data
        if (x.parent.accountDto.name === name) {
            const parentData = x.parent.cars as Array<CarProps>
            const ChildData = x.child.map((t:any)=>t.cars).flat()
            setData(parentData.concat(ChildData))
            setisloading(false)
        }else{
          const childOnlyData =  x.child.map((t:any)=>t.cars).flat();

          setData(childOnlyData)
          setisloading(false)
        }

      }).catch((error)=>{
        console.log(error)
        setisloading(false)
      })
      //  pull  data after  every 1 update to suitable time 

    }, 1500);

    // clean up
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    let carId = unitId?.code ? unitId.code : 1356089
    const today = new Date();
    const pastDate = new Date(today.getTime() - time * 24 * 60 * 60 * 1000)
    axios.post(getFullUrl(`/api/v1/gps/carHistory?token=${token}`),{
        carId: carId,
        startTime: pastDate.toISOString().slice(0, 19).replace('T', ' '),
        endTime: today.toISOString().slice(0, 19).replace('T', ' ')
      
    }).then((res)=>{
        const d = res.data as Array<CarHistoryProps>
        if(d.length < 1 && showTracks){
            growl.current.show({
              summary:"No record found for this unit",
              severity:"info"
            })
        }
        const s =  d.sort((a, b) => new Date(a.pointDt).getTime() -new Date(b.pointDt).getTime())  
        setTracks(s)
    }).catch((error)=>{
      console.log(error)
    })
  }, [unitId,time]);



  React.useEffect(() => {
        axios.get(getFullUrl(`/api/v1/gps/carInfoById?carId=${unitId?.code}&token=${token}`),{
      }).then((res)=>{
        const  x = res.data as ICarInformation
        setCarInfo(x)
  }).catch((error)=>{
    console.log(error)
  })
  }, [unitId])
  


  React.useEffect(()=>{
    setShowTracks(props.tracks)
    setMessages(props.msg)
  },[props])

  const [close, showClosed] = React.useState(true)
  const [manageModal,setModal] =  React.useState(false)

  return (
    <>
      <Content open={close}>
        {manageModal && (
             <div className="MapOptions">
             {showTracks &&(<TracksScreen  setPlay={setPlay} setTime={setTime} setSpeed={setSpeed}
                     setUnitId={setUnitId} data={tracks} units={data} />)}
             {showMessages && (<MessageScreen  units={data}  setUnitId={setUnitId} carInfo = {carInfo}/>)}
             {props.monitoring && (<MonitorControl  car={data} setSelectedUnit={setUnitId} />)}
             {props.notifications && (<Notifications   setUnitId={setUnitId} data = {data} token={token} />)}
         </div>
        )}
       
        <div className='modal-button'>
          {
            manageModal ? <i onClick={()=>setModal(false)} className="pi pi-directions-alt" style={{fontSize:'2rem', color:'#007ad9'}}></i> 
            : <i  onClick={()=>setModal(true)} className="pi pi-directions" style={{fontSize:'2rem', color:'#007ad9'}}></i>
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
          />
        </div>
      </Content>
    </>
  )
}

type SelectedUnit = {
  name:string;
  code:string
}

const StyledDiv = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: flex;
        justify-content: inherit;
        bottom: 4rem;
        position: fixed;
        margin: 16px 35px;
        border-radius: 50%;
    }
`
const TracksScreen = (props:any) => {
  const [selectedCar,setSelectedUnit] = React.useState<Car>({name:1356089, code:1356089});
  const [checked, setChecked] = React.useState<boolean>(true);
  const [speed,setSpeed] = React.useState("5");
  const [time,setTime] = React.useState<number>(20)
  const [dropDownOptions,setdropDownOptions] = React.useState(Array<Car>())

  React.useEffect(() => {
    const d : Car[] = props.units.map((r:CarProps)=>{
        return {
          name:r.carId, code:r.carId
        }
    })  
    setdropDownOptions(d)
    
  }, [props.units])


  const [open] = React.useState(false);
  const selectButtonOptions: string[] = ['לפני שבעה ימים', 'לפני עשרים יום'];
  const [value, setValue] = React.useState<string>(selectButtonOptions[1]);

  React.useEffect(()=>{
    props.setUnitId(selectedCar)
    props.setSpeed(speed)
    if(value === selectButtonOptions[1]){
      setTime(20)
    }else{
      setTime(7)
    }
    props.setTime(time)  

  },[selectedCar,time,speed, value])

  return (
   <>

    <div className='tracks-container'>
          <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setSelectedUnit(e.value)} options={dropDownOptions} optionLabel="name" placeholder="בחר רכב" 
        filter   />
    </div>
    <div className="card flex justify-content-center button-set">
        <span className="p-buttonset">
          <SelectButton value={value} onChange={(e) => setValue(e.value)} options={selectButtonOptions} />
        </span> 
    </div>
    <Divider />
    <div className='tracks-container'>
      <label className='tracks-label'>שם יחידה</label>
      <InputText  value={selectedCar?.name as unknown as string} readOnly className='tracks-input'/>
    </div>
    {/* <div className='tracks-container'>
      <label className='tracks-label'>צֶבַע</label>
      <InputText value='By trips' readOnly  className='tracks-input'/>
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>קבע מהירות</label>
      <InputNumber className='tracks-input' inputId="integeronly" value={speed} onValueChange={(e: InputNumberValueChangeEvent) => setSpeed(e.value)} />
      <InputText value={speed} className="tracks-input" onChange={(e)=>setSpeed(e.target.value)}  placeholder='מְהִירוּת'/>
    </div> */}
    <Divider />
   
      {selectedCar?.name && (
         <div className='icons-tracks'>
          <p className='track-container-title{'></p>
          <Tooltip className='.tracks-icons' />
         <p>{selectedCar?.name}</p>
           {/* <Checkbox onChange={e => setChecked(e.value)} checked={checked}></Checkbox> */}
           <i onClick={()=>props.setPlay(true) } className="pi pi-play tracks-icons" data-pr-data-pr-tooltip='start unit movement' style={{ color: 'green' }}></i>
           <i onClick={()=>props.setPlay(false) }className="pi pi-pause tracks-icons" data-pr-data-pr-tooltip='stop  unit movement' style={{ color: 'green' }}></i>
       </div>
      
    )}
     <Divider />
   </>
  )
}
const MessageScreen = (props:any) => {
  const [selectedCar,setSelectedUnit] = React.useState<Car>({name:1356089, code:1356089});
  const [dropDownOptions,setdropDownOptions] = React.useState(Array<Car>());
  const [carInformation,setCarInformation]= React.useState<ICarInformation>(props.carInfo);


  React.useEffect(() => {
    const d : Car[] = props.units.map((r:CarProps)=>{
        return {
          name:r.carId, code:r.carId
        }
    })  
    setdropDownOptions(d)
    
  }, [props.units])

  React.useEffect(()=>{
    props.setUnitId(selectedCar)
    setCarInformation(props.carInfo)
  },[selectedCar])

  return (
   <>
    <div className='tracks-container'>
    <div className='tracks-container'>
          <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setSelectedUnit(e.value)} options={dropDownOptions} optionLabel="name" placeholder="בחר רכב" 
        filter   />
    </div>
      
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>שם המכונה</label>
      <InputText value={carInformation?.machineName} readOnly />
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>imei</label>
      <InputText value= {carInformation?.imei} readOnly />
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

const MonitorControl:FunctionComponent<CarDto> = ({car,setSelectedUnit}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredItems,setFilteredItems] = React.useState<Array<CarProps>>(car)
  const [checked, setChecked] = React.useState<boolean>(true);
  const [address, setAdress] = React.useState("")

  React.useEffect(()=>{
    setFilteredItems(car)
  },[car])


  const handleSelectedUnit = (unitid:number)=>{
        const r: Car = {
          name:unitid, code:unitid
        }

        setSelectedUnit(r)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = filteredItems.filter((item:CarProps) =>
      item.carId.toString().toLowerCase().includes(term.toLowerCase()) 
      || item.exData.toLocaleLowerCase().includes(term.toLocaleLowerCase())
    );
    setFilteredItems(filtered);
  };  
  const [open, setOpen] = React.useState(false);

  const ComputeAddress = async (r:CarProps)=>{
      try{
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${r.lon},${r.lat}.json?language=he&access_token=pk.eyJ1IjoiY2hhbm4iLCJhIjoiY2w3OHI1a293MGI4aTNxbzh1dHI5b2owaSJ9.RSbIOzGoHc8JnKvgyIWZ4w`
        );
        const data = await response.json();
        setAdress(data.features[0].place_name_he)

      }catch{
        console.log("problem getting address")
      }
      confirmDialog({
        message:address ,
        header: 'כתובת היחידה',
        icon: 'pi pi-marker',
    });
  }

  return (
   <>
    <ConfirmDialog />
   <Tooltip target=".custom-target-icon"  />
    <div className='tracks-container'>
      <div className='tracks-container'>
        <InputText className='monitor-search-term' value={searchTerm} onChange={handleSearch}  placeholder='חיפוש לפי מספר מכשיר'/>
      </div>
    </div>
    <Divider />
    {
      filteredItems && filteredItems.map((r:CarProps)=> 
      <div className='monitor-search-icons' >
          {/* <Checkbox checked={checked}></Checkbox> */}
          {/* <img src={carSmall} alt="" className='custom-target-icon' data-pr-tooltip={r.exData} /> */}
          {r.machineName}
         <InlineItems>
         <Tooltip target=".custom-target-icon"  />
            <i  data-pr-tooltip="לְאַתֵר" onClick={()=>handleSelectedUnit(r.carId)}
                    className="pi pi-map-marker custom-target-icon" style={{ color: '#263af7' }}></i>
              <i  className="pi pi-home custom-target-icon" style={{ color: '#263af7' }} 
              onClick={()=>ComputeAddress(r)} data-pr-tooltip="כתובת"></i>
              {/* <i className="pi pi-pause custom-target-icon" style={{ color: '#263af7' }}></i> */}
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
    <Divider />

   </>
  )
}

interface Car {
  name: number;
  code: number;
}

const NortificationActions = styled.div`
    display:flex;
    justify-content:flex-end;
    padding:5px;
    p{
      margin:auto;
    }
    i{
      margin:auto;
    }
`
const Notifications = (props:any) => {
  const growl = React.useContext(GrowlContext)
  const [alarms,setAlarms] = React.useState(Array<CarAlarmProps>())
  const [options,setOptions] = React.useState(Array<SearchParamsDto>())
  const [dropDownOptions,setdropDownOptions] = React.useState(Array<Car>())
  const [selectedUnit, setSelectedUnit] = React.useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filtered,setFiltered] = React.useState(Array<CarAlarmProps>())
  const [notification,setNotification] = React.useState<CarAlarmProps>()

    React.useEffect(() => {
      const d : Car[] = props.data.map((r:CarProps)=>{
          return {
            name:r.carId, code:r.carId
          }
      })  
      setdropDownOptions(d)
    }, [props.data])

  
  React.useEffect(()=>{
  
    if (!selectedUnit) {
      return
    }


    //  pass the selected to map

    props.setUnitId(selectedUnit)
    axios.get(getFullUrl(`/api/v1/gps/alarmsByCar?carId=${selectedUnit.code}&token=${props.token}`)).then((res)=>{
      if(res.data.length <0){
        growl.current.show({
          summary:"No Unread alarms for this unit",
          severity: "success"
        })
      }else{
        const x = res.data as Array<CarAlarmProps>
        // const newNotifications = x.filter((n)=> n.isNew === true )
        setAlarms(x)

      const uniqueItems = x.filter((item, index, self) =>
        index === self.findIndex((t) => t.carId === item.carId)
      );
     
      const labelOptions:Car[] = uniqueItems.map((x)=>{
        return {
          name:x.carId, code:x.carId
        }
      })
      setOptions(labelOptions)
      }
    }).catch((error)=>{
      console.log("there's a problem")
    })
      // To Do  change this to dynamic car id 
     
  },[selectedUnit])

  React.useEffect(()=>{
    props.setUnitId(selectedUnit)
  },[selectedUnit])

  const Search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const m = filtered.filter((item:CarAlarmProps) =>
      item.userId.toString().toLowerCase().includes(term.toLowerCase()) 
      || item.carId.toString().toLocaleLowerCase().includes(term.toLocaleLowerCase())
    );
    setFiltered(m);
  };  

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
    }).then((res)=>{
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
  // TO DO  : temporary move this to HCO 
  const [open, setOpen] = React.useState(false);

    return (
   <>
      <Dialog header="Send Notification" visible={show} style={{ width: '35vw' }} onHide={() => setShow(false)} modal={false}>
        <div className="share">
              <label className='labels'>מספר טלפון</label>
              <InputText className='input' value={phone}  onChange={(e)=>setPhone(e.target.value)} placeholder="+ country code e.g +254700000"/>
        </div>
        <Button disabled={!canSend} className='button' onClick={sendNotification} icon="pi pi-send" label='Send'/>
      </Dialog>
      <Tooltip target=".custom-target-icon"  />
      <div className='monitor-search-icons'>
        <Dropdown value={selectedUnit} onChange={(e: DropdownChangeEvent) => setSelectedUnit(e.value)} options={dropDownOptions} optionLabel="name" 
                    placeholder="Select a unit" className="w-full md:w-17rem monitor-search-term" />
      </div>
     <Divider />
     <Tooltip target=".custom-target-icon"  />
      {alarms.length < 1 ? <p style={{textAlign:"center"}}>אין רשומות עבור יחידה זו</p>
        : <div style={{maxHeight:"28rem", overflowY:"auto"}}>
        {
        alarms.map((x,index)=>
          <div className='monitor-search-icons' >
        
                  {x.machineName}
                  
                <InlineItems>
                {x.alarDescription}
  
                    <i  data-pr-tooltip="לַחֲלוֹק " onClick={()=>handleShowModal(x)}
                            className="pi pi-share-alt custom-target-icon" style={{ color: '#263af7',marginTop:"5px" }}></i>
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