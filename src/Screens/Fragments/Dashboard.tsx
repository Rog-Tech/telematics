import React, { FunctionComponent } from 'react'
import MapWrapper from '../../Components/Map/MapWrapper'
import Header from '../../Components/Navigation/Header'
import {Splitter} from 'primereact/splitter'
import { SplitterPanel } from 'primereact/splitter'
import { Dropdown, DropdownChangeEvent, DropdownProps } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';       
import './Dashboard.css'
import { Divider } from 'primereact/divider'
import { Checkbox } from "primereact/checkbox";
import axios from 'axios'
import { Buffer } from 'buffer'
import { getFullUrl } from '../../Utils/Helper';
import carSmall from '../../assets/carSmall.png'
import batteryStatus from '../../assets/batteryStatus.svg'
import { Tooltip } from 'primereact/tooltip';
import { CarAlarmProps, CarProps, SearchParamsDto } from '../../types/Types'
import { Button } from 'primereact/button'
import { Token } from '../../Utils/constants'
import { Dialog } from 'primereact/dialog';
import GrowlContext from '../../Utils/growlContext'
interface CarDto {
  car:Array<CarProps>
}

export const Dashboard = (props:any) => {
  const[showTracks,setShowTracks] = React.useState(props.tracks)
  const[showMessages,setMessages] = React.useState(props.msg)
  const [playTrack, setPlay] = React.useState(false);
  const [data,setData] = React.useState(Array<CarProps>());
  const [unitId,setUnitId] = React.useState("")

  React.useEffect(() => {
    const interval = setInterval(async () => {
      axios.get(getFullUrl('/api/v1/gps/cars'),{
        headers:{
          'Authorization': `Basic ${Token}`
        }
      }).then((res)=>{
           const d = res.data as Array<CarProps>
        setData(d)
      }).catch((error)=>{
        console.log(error)
      })
      //  pull  data after  every 1 update to suitable time 

    }, 30000);

    // clean up
    return () => clearInterval(interval);
  }, []);

  React.useEffect(()=>{
    setShowTracks(props.tracks)
    setMessages(props.msg)
  },[props])

 

  return (
    <Splitter style={{ height: '300px' }}>
    <SplitterPanel size={100}>
        <Splitter layout="vertical">
            <SplitterPanel size={100}>
                <Splitter>
                    <SplitterPanel size={30}>
                       {showTracks &&(<TracksScreen setPlay={setPlay} setUnitId={setUnitId}/>)}
                       {showMessages && (<MessageScreen />)}
                       {props.monitoring && (<MonitorControl car={data} />)}
                       {props.notifications && (<Notifications setUnitId={setUnitId} />)}
                    </SplitterPanel>
                    <SplitterPanel>
                        <MapWrapper 
                            playTrack = {playTrack}
                            showTracks = {showTracks}
                            data = {data}
                            notifications = {props.notifications}
                            messages = {props.showMessages}
                            monitoring = {props.monitoring}
                           
                            />
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>
        </Splitter>
    </SplitterPanel>
    </Splitter>

  )
}



const TracksScreen = (props:any) => {
  const [selectedCar] = React.useState(null);
  
  const countries = [
    { name: "359510088161794", code: '359510088161794' },
];
  return (
   <>
    <div className='tracks-container'>
      <label className='tracks-label'>Unit ID</label>
      <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => props.setUnitId(e.value)} options={countries} optionLabel="name" placeholder="Select a vehicle" 
        filter   />
      
    </div>
    <div className='show-tracks'>
      <i onClick={()=>props.setPlay(true) } className="pi pi-play" style={{ color: 'slateblue' }}></i>
      <i onClick={()=>props.setPlay(false) }className="pi pi-pause" style={{ color: 'green' }}></i>
    </div>
   
   </>
  )
}
const MessageScreen = (props:any) => {
  const [selectedCar, setselectedCar] = React.useState(null);
  
  const countries = [
    { name: "359510088161794", code: '359510088161794' },
];
  return (
   <>
    <div className='tracks-container'>
      <label className='tracks-label'>Unit Id</label>
      <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setselectedCar(e.value)} options={countries} optionLabel="name" placeholder="Select a vehicle" 
    filter   />
      
    </div>
    

    <div className='tracks-container'>
      <label className='tracks-label'>Unit Name</label>
      <InputText value='cgch253536' readOnly />
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>Message Type</label>
      <InputText value='cgch253536' readOnly />
    </div>
    <Divider />
    <Panel header="Summary" toggleable>
        <p className="m-0 tracks-label">Total Messages:</p>
        <p className="m-0 tracks-label">Total Time:</p>
        <p className="m-0 tracks-label">Distance:</p>
        <p className="m-0 tracks-label">Average Speed:</p>
        <p className="m-0 tracks-label">Top Speed:</p>
    </Panel>
   </>
  )
}

const MonitorControl:FunctionComponent<CarDto> = ({car}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredItems,setFilteredItems] = React.useState<Array<CarProps>>(car)
  const [checked, setChecked] = React.useState<boolean>(false);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = filteredItems.filter((item:CarProps) =>
      item.imei.toLowerCase().includes(term.toLowerCase()) 
      || item.exData.toLocaleLowerCase().includes(term.toLocaleLowerCase())
    );
    setFilteredItems(filtered);
  };  

  const handleDisplay = (event:React.ChangeEvent<HTMLInputElement>) => {
    if(event.currentTarget.checked){
      console.log("activate map console")
    }else{
      console.log("hide map")
    }
  }

  return (
   <>
   <Tooltip target=".custom-target-icon"  />
    <div className='tracks-container'>
      <div className='tracks-container'>
        <InputText className='monitor-search-term' value={searchTerm} onChange={handleSearch}  placeholder='Search by imei or ..'/>
      </div>
    </div>
    <Divider />
    {
      filteredItems && filteredItems.map((r:CarProps)=> 
      <div className='monitor-search-icons'>
      <Checkbox onChange={()=>handleDisplay} checked={checked}></Checkbox>
      <img src={carSmall} alt="" className='custom-target-icon' data-pr-tooltip={r.exData} />
      {r.carId}
      <i  data-pr-tooltip="Track unit on the map" 
             className="pi pi-map-marker custom-target-icon" style={{ color: 'green' }}></i>
      <i  className="pi pi-play custom-target-icon" style={{ color: 'slateblue' }}></i>
      <i className="pi pi-pause custom-target-icon" style={{ color: 'green' }}></i>
      <i className="pi pi-info-circle custom-target-icon" 
          style={{ color: 'green' }}  data-pr-tooltip="Status is unknown"  ></i>
      <img src={batteryStatus} alt="" 
          className='custom-target-icon img-icons' 
            data-pr-tooltip={r.exData} />
      <i data-pr-tooltip="The unit is online" className="pi pi-wifi custom-target-icon" style={{ color: 'green' }}></i>
    </div>
    )}
   </>
  )
}

interface Car {
  name: number;
  code: number;
}
const Notifications = (props:any) => {
  const growl = React.useContext(GrowlContext)
  const [alarms,setAlarms] = React.useState(Array<CarAlarmProps>())
  const [options,setOptions] = React.useState(Array<SearchParamsDto>())
  const [selectedUnit, setSelectedUnit] = React.useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filtered,setFiltered] = React.useState(Array<CarAlarmProps>())
  const [notification,setNotification] = React.useState<CarAlarmProps>()
 
  React.useEffect(()=>{
      // To Do  change this to dynamic car id 
      axios.get(getFullUrl(`/api/v1/gps/alarmsByCar?carId=${1356089}`),{
        headers:{
          'Authorization': `Basic ${Token}`
        }
      }).then((res)=>{
          const x = res.data as Array<CarAlarmProps>
          const newNotifications = x.filter((n)=> n.isNew === true )
         
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

      }).catch((error)=>{
        console.log("there's a problem")
      })
  },[])

  React.useEffect(()=>{
    props.setUnitId(selectedUnit)
    // props.showAlerts(switchModalContent)
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
  const alerts =()=>{

  }
  const canSend = phone !== ""
  const sendNotification = ()=>{
    console.log("i am being clicked ")
    console.log(notification)
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
  return (
   <>
    <Dialog header="Send Notification" visible={show} style={{ width: '35vw' }} onHide={() => setShow(false)}>
    <div className="share">
            <label className='labels'>Phone Number</label>
            <InputText className='input' value={phone}  onChange={(e)=>setPhone(e.target.value)} placeholder="+ country code e.g +254700000"/>
       </div>
      <Button disabled={!canSend} className='button' onClick={sendNotification} icon="pi pi-send" label='Send'/>
   </Dialog>
   <Tooltip target=".custom-target-icon"  />
   <div className='monitor-search-icons'>
    <Button label='New' />
    {/* <Dropdown value={selectedUnit} placeholder='All' 
       onChange={(e: DropdownChangeEvent) => setSelectedUnit(e.value)} 
      options={options} optionLabel="name" /> */}
    <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Search" value={searchTerm} onChange={Search}/>
    </span>
   </div>
   <table className='table'>
   <Tooltip target=".custom-target-icon"  />
    <tr>
      <th>
       Description
      </th>
      <th>
        <i data-pr-tooltip="Disable notifications" 
            className="pi pi-power-off custom-target-icon" 
              style={{ color: 'red' }}></i>
      </th>
      <th>
      <i data-pr-tooltip="Actions: Send Notifications " 
            className="pi pi-cog custom-target-icon" 
              style={{ color: 'green' }}></i>
      </th>
      <th>
      <i data-pr-tooltip="Unit" 
            className="pi pi-truck custom-target-icon" 
              style={{ color: 'green' }}></i>
      </th>
      <th>
      <i data-pr-tooltip="Delete" 
            className="pi pi-trash custom-target-icon" 
              style={{ color: 'green' }}></i>
      </th>
    </tr>
    
      {
        alarms.map((x,index)=>
        <tr>
        <td>{x.alarDescription}</td>
        <td>
        <i data-pr-tooltip="Disable notifications" 
            className="pi pi-check custom-target-icon" 
              style={{ color: 'green' }}></i>
        </td>
        <td>
        <i onClick={()=> handleShowModal(x)} data-pr-tooltip="Share notification" 
              className="pi pi-share-alt custom-target-icon" 
                style={{ color: 'green' }}></i>
         
        </td>
        <td>
        <img src={carSmall} alt="" 
            className='custom-target-icon' data-pr-tooltip={"Unit Id: " + x.carId as unknown as string} />
        </td>
        <td>
          <i data-pr-tooltip="Delete notification" 
              className="pi pi-times custom-target-icon" 
                style={{ color: 'red' }}></i>
        </td>
        </tr>
        )
      }
   
   </table>
   </>
  )
}
