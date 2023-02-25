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
import { DateFormatOptions, getFullUrl } from '../../Utils/Helper';
import carSmall from '../../assets/carSmall.png'
import batteryStatus from '../../assets/batteryStatus.svg'
import { Tooltip } from 'primereact/tooltip';
import { CarAlarmProps, CarHistoryProps, CarProps, SearchParamsDto } from '../../types/Types'
import { Button } from 'primereact/button'
import { Token } from '../../Utils/constants'
import { Dialog } from 'primereact/dialog';
import GrowlContext from '../../Utils/growlContext'
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { type } from 'os'
interface CarDto {
  car:Array<CarProps>
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
  const [unitId,setUnitId] = React.useState("")
  const [time,setTime] = React.useState<number>(3)
  const [speed,setSpeed] = React.useState("1");

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

  React.useEffect(() => {
    console.log(time)
    const today = new Date();
    const pastDate = new Date(today.getTime() - time * 24 * 60 * 60 * 1000)
    axios.post(getFullUrl('/api/v1/gps/carHistory'),{
      carId:1356089,
      startTime:pastDate.toISOString().slice(0, 19).replace('T', ' '),
      endTime:today.toISOString().slice(0, 19).replace('T', ' ')
    },{
      headers:{
        'Authorization': `Basic ${Token}`
      }
    }).then((res)=>{
        const d = res.data as Array<CarHistoryProps>
        // const filteredArray = myArray.filter(
        //   (item) => item.date >= threeDaysAgo && item.date <= today
        // );
        setTracks(d)
    }).catch((error)=>{
      console.log(error)
    })
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
                       {showTracks &&(<TracksScreen setPlay={setPlay} setTime={setTime} setSpeed={setSpeed}
                            setUnitId={setUnitId} data={tracks}/>)}
                       {showMessages && (<MessageScreen />)}
                       {props.monitoring && (<MonitorControl car={data} />)}
                       {props.notifications && (<Notifications setUnitId={setUnitId} />)}
                    </SplitterPanel>
                    <SplitterPanel>
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
                            />
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>
        </Splitter>
    </SplitterPanel>
    </Splitter>

  )
}

type SelectedUnit = {
  name:string;
  code:string
}


const TracksScreen = (props:any) => {
  const [selectedCar,setSelectedUnit] = React.useState<SelectedUnit>();
  const [checked, setChecked] = React.useState<boolean>(true);
  const [speed,setSpeed] = React.useState("1");
  const [time,setTime] = React.useState<number>(3)
  const countries:SelectedUnit[] = [
    { name: "359510088161794", code: '359510088161794' },
  ];
  React.useEffect(()=>{
    props.setUnitId(selectedCar?.name)
    props.setSpeed(speed)
    props.setTime(time)  
  },[selectedCar,time,speed])
  return (
   <>
    <div className='tracks-container'>
          <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setSelectedUnit(e.value)} options={countries} optionLabel="name" placeholder="בחר רכב" 
        filter   />
    </div>
    <div className="card flex justify-content-center button-set">
        <span className="p-buttonset">
            <Button onClick={()=>setTime(3)} label="3 Days a go"  />
            <Button onClick={()=>setTime(7)} label="7 Days a go"  />
            <Button onClick={()=>setTime(0)} label="Today"  />
        </span>
    </div>
    <Divider />
    <div className='tracks-container'>
      <label className='tracks-label'>שם יחידה</label>
      <InputText value={selectedCar?.name} readOnly className='tracks-input'/>
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>צֶבַע</label>
      <InputText value='By trips' readOnly  className='tracks-input'/>
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>קבע מהירות</label>
      {/* <InputNumber className='tracks-input' inputId="integeronly" value={speed} onValueChange={(e: InputNumberValueChangeEvent) => setSpeed(e.value)} /> */}
      <InputText value={speed} className="tracks-input" onChange={(e)=>setSpeed(e.target.value)}  placeholder='מְהִירוּת'/>
    </div>
    <Divider />
      {selectedCar?.name && (
         <div className='icons-tracks'>
         <p>{selectedCar?.name}</p>
           <Checkbox onChange={e => setChecked(e.value)} checked={checked}></Checkbox>
           <i onClick={()=>props.setPlay(true) } className="pi pi-play" style={{ color: 'slateblue' }}></i>
           <i onClick={()=>props.setPlay(false) }className="pi pi-pause" style={{ color: 'green' }}></i>
       </div>
    )}
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
      <label className='tracks-label'>מספר מכשיר</label>
      <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setselectedCar(e.value)} options={countries} optionLabel="name" placeholder="בחירת מכשיר" 
    filter   />
      
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>שם יחידה</label>
      <InputText value='cgch253536' readOnly />
    </div>
    <div className='tracks-container'>
      <label className='tracks-label'>סוג הודעה</label>
      <InputText value='cgch253536' readOnly />
    </div>
    <Divider />
    <Panel header="Summary" toggleable>
        <p className="m-0 tracks-label">:סה"כ הודעות</p>
        <p className="m-0 tracks-label">:סה"כ זמן</p>
        <p className="m-0 tracks-label">:מרחק</p>
        <p className="m-0 tracks-label">מהירות ממוצעת:</p>
        <p className="m-0 tracks-label">מהירות מירבית:</p>
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
        <InputText className='monitor-search-term' value={searchTerm} onChange={handleSearch}  placeholder='חיפוש לפי מספר מכשיר'/>
      </div>
    </div>
    <Divider />
    {
      filteredItems && filteredItems.map((r:CarProps)=> 
      <div className='monitor-search-icons'>
      <Checkbox onChange={()=>handleDisplay} checked={checked}></Checkbox>
      <img src={carSmall} alt="" className='custom-target-icon' data-pr-tooltip={r.exData} />
      {r.carId}
      <i  data-pr-tooltip="מציאת היחידה במפה" 
             className="pi pi-map-marker custom-target-icon" style={{ color: 'green' }}></i>
      <i  className="pi pi-play custom-target-icon" style={{ color: 'slateblue' }}></i>
      <i className="pi pi-pause custom-target-icon" style={{ color: 'green' }}></i>
      <i className="pi pi-info-circle custom-target-icon" 
          style={{ color: 'green' }}  data-pr-tooltip="סטטוס לא ידוע"  ></i>
      <img src={batteryStatus} alt="" 
          className='custom-target-icon img-icons' 
            data-pr-tooltip={r.exData} />
      <i data-pr-tooltip="היחידה מופעלת" className="pi pi-wifi custom-target-icon" style={{ color: 'green' }}></i>
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
            <label className='labels'>מספר טלפון</label>
            <InputText className='input' value={phone}  onChange={(e)=>setPhone(e.target.value)} placeholder="+ country code e.g +254700000"/>
       </div>
      <Button disabled={!canSend} className='button' onClick={sendNotification} icon="pi pi-send" label='Send'/>
   </Dialog>
   <Tooltip target=".custom-target-icon"  />
   <div className='monitor-search-icons'>
    <Button label='חדש' />
    {/* <Dropdown value={selectedUnit} placeholder='All' 
       onChange={(e: DropdownChangeEvent) => setSelectedUnit(e.value)} 
      options={options} optionLabel="name" /> */}
    <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="חיפוש" value={searchTerm} onChange={Search}/>
    </span>
   </div>
   <table className='table'>
   <Tooltip target=".custom-target-icon"  />
    <tr>
      
      <th>
       תיאור
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
