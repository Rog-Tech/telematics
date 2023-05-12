import { Toast } from 'primereact/toast'
import React, { FunctionComponent, useRef, useState } from 'react'
import { SpeedDial } from 'primereact/speeddial';
import { MenuItem } from 'primereact/menuitem';
import { Badge } from 'primereact/badge';
import { CarAlarmProps, CarHistoryProps } from '../types/Types';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { getFullUrl } from '../Utils/Helper';
import { Token } from '../Utils/constants';
import { Tooltip } from 'primereact/tooltip';
import { Divider } from 'primereact/divider';
import GrowlContext from '../Utils/growlContext';
import styled from 'styled-components';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Loader } from '../Screens/Fragments/Dashboard';
import { ProgressSpinner } from 'primereact/progressspinner';

interface AlarmProps {
    Alarms:Array<CarAlarmProps>
    token:string
}

interface AlarmHistory extends AlarmProps{
  carId:string;
}
  
export const MenuItems = (props:any) => {
    const usrCtx = JSON.parse( window.localStorage.getItem('refreshToken')!)
    const {name,token} =  usrCtx;
    const toast = useRef<Toast>(null);
    const [showAlerts,setShowAlerts] = React.useState(false)
    const [newAlarms,setNewAlarms] = React.useState(Array<CarAlarmProps>())
    const [toggle, settoggle] = useState(true)
    const [title, settitle] = useState("התראה חדשה")
   
    React.useEffect(()=>{

      if (!props.selectedUnit) {
        return
      }
        const interval = setInterval(async () => {
            axios.get(getFullUrl(`/api/v1/gps/alarmsByCar?carId=${props.selectedUnit.code}&token=${token}`)).then((res)=>{

                  const x = res.data as Array<CarAlarmProps>
                  const sorted = x.sort((a, b) => new Date(a.alarmTime).getTime() -new Date(b.alarmTime).getTime());
                  // console.log(sorted.reverse())
                  setNewAlarms(sorted.reverse())
                  props.setNewAlarms(sorted.reverse())
              }).catch((error)=>{
                // console.log("there's a problem")
              })
        },1500)
          return () => clearInterval(interval);
    },[props.selectedUnit])

    React.useEffect(()=>{
        if(newAlarms.length > 0 && props.notifications){
            setShowAlerts(true)
        }
        // avoid multiple screen renders
        return () => setShowAlerts(false)
    },[])
    const items: MenuItem[] = [
        {
            label: 'Add',
            icon: 'pi pi-bell',
            command: () => {
                setShowAlerts(true)
                settoggle(true)
            }
        },
       
        {
            label: 'History',
            icon: 'pi pi-calendar-plus',
            command: () => {
               settoggle(false)
               setShowAlerts(true)
               settitle("היסטוריית אזעקות")
            }
        }
    ];
    return (
        <>
        {
          props.selectedUnit &&( <Dialog modal={false} header={`${title}- Unit : ${props.selectedUnit.code}`} visible={showAlerts} style={{ width: '48vw' }} onHide={() => setShowAlerts(false)}>
         
          {toggle ?  <RenderNotifications Alarms={newAlarms} token={token}/> :  <NortificationHistory carId={props.selectedUnit.code} Alarms={[]} token={token}/>}  
         </Dialog>)
        }
       
            <div className='floating-menu'>
            <Badge className='notification-badge' value={newAlarms.length}></Badge>
            <Toast ref={toast} />
            <SpeedDial showIcon="pi pi-bell" model={items} direction="up" style={{ left: 'calc(50% - 2rem)', bottom: 0 }} />
         </div>
        </>
    )
}

const MenuInline = styled.div`
  p{
    margin:5px;
  }
  i{
    margin-top: 10px;
    margin-left: 5px;
  }
  .machine{
    color:#3447f7;
    font-weight:400;
  }
`

const RenderNotifications:FunctionComponent<AlarmProps> = ({Alarms,token}) => {
    const growl = React.useContext(GrowlContext)

    const deleteNotification = (alarm:string)=>{
        // /api/v1/gps/markAlarmAsRead?alarmId=70ab03a6-b466-42de-ba1b-bfaedc8c4d84
        axios.post(getFullUrl(`/api/v1/gps/markAlarmAsRead?alarmId=${alarm}&token=${token}`),{},{
          headers: {
            'Authorization': `Basic ${Token}` 
          }
        }).then((res)=>{
            growl.current.show({
              severity:"success",
              summary: `Notification deleted`
            })
           
        }).catch((error)=>{
          growl.current.show({
            severity:"error",
            summary: `Error unable  delete the notification`
          })
        })
    }
    return (
      <MenuInline>
        <Tooltip target=".custom-target-icon"  />
          {
            Alarms.map((x,i)=>
            
            <>
             <div key={i} className= 'notification-popups'>
             <p  data-pr-tooltip="Time"  className='custom-target-icon'>{x.alarmTime}</p> <Divider layout='vertical' />
              <p  data-pr-tooltip="Unit name"  className='machine custom-target-icon'>{x.machineName}</p>
              <Divider layout='vertical' />
              <p  data-pr-tooltip="Alert"  className='custom-target-icon'>{x.alarDescription}</p>
              <Divider layout='vertical' />
              <i data-pr-tooltip="Mark as read"  onClick={()=>deleteNotification(x.alarmId)}
                     className="pi pi-thumbs-up custom-target-icon" style={{ fontSize: '1rem',color:"green" }}></i>
              {/* <i data-pr-tooltip="Delete Notification" 
                     className="pi pi-trash custom-target-icon" style={{ fontSize: '1rem',color:"red" }}></i> */}
            </div>
            <Divider />
            </>
            
            )
          }
      </MenuInline>
    )
  }

  const NortificationContainer = styled.div`
      margin-bottom:20px;
      justify-content:end;
    	button{
        margin-left:5px;
        border-radius:15px;
      }
  `
  const NortificationHistory:FunctionComponent<AlarmHistory> = ({token,carId})=>{
    const growl = React.useContext(GrowlContext);
    const [newAlarms,setNewAlarms] = React.useState(Array<CarAlarmProps>())
    const newDates = [new Date(), new Date()];
    const [dates, setDates] = React.useState<Date[]>(newDates);
    const [isloading, setisloading] = React.useState(false)
    const canSearch = dates.length > 1
    const search = ()=>{
      setisloading(true)
      axios.post(getFullUrl(`/api/v1/gps/carAlarmHistory?token=${token}`),{
        carId: carId,
        startTime:dates[0].toISOString().slice(0, 19).replace('T', ' '),
        endTime: dates[1].toISOString().slice(0, 19).replace('T', ' ')
      
      }).then((res)=>{
          const d = res.data as Array<CarAlarmProps>
          if (d.length <1) {
            growl.current.show({
              summary:"No record for that date range",
              severity:'info'
            })
          }
          
          const s =  d.sort((a, b) => new Date(a.alarmTime).getTime() -new Date(b.alarmTime).getTime())  
          setNewAlarms(s)
          setisloading(false)
      }).catch((error)=>{
        growl.current.show({
          summary:"No record for that date range",
          severity:'info'
        })
        setisloading(false)
        // console.log(error)
      })

    }
    return (
      <MenuInline>
        {isloading &&( <Loader className="flex justify-content-center">
              <ProgressSpinner />
          </Loader>)}
        <Tooltip target=".custom-target-icon"  />
        <NortificationContainer className="card flex justify-content-center">
          <p>בחר טווח תאריכים</p>
          <Calendar value={dates} onChange={(e) => setDates(e.value as Array<Date>)} selectionMode="range" readOnlyInput dateFormat="dd/mm/yy" showIcon />
          <Button  icon="pi pi-search" label='שאילתא' onClick={search}/>
        </NortificationContainer>

          {
            newAlarms.map((x,i)=>
            
            <>
             <div key={i} className= 'notification-popups'>
             <p  data-pr-tooltip="Time"  className='custom-target-icon'>{x.alarmTime}</p> 
              <Divider  layout='vertical'/>
              <p  data-pr-tooltip="Unit name"  className='machine custom-target-icon'>{x.machineName}</p>
              <p  data-pr-tooltip="Alert"  className='custom-target-icon'>{x.alarDescription}</p>
            
            </div>
            <Divider style={{margin:"0px", border: "1px dashed"}} />
            </>
            
            )
          }
      </MenuInline>
    )
  }