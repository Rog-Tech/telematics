import { Toast } from 'primereact/toast'
import React, { FunctionComponent, useRef } from 'react'
import { SpeedDial } from 'primereact/speeddial';
import { MenuItem } from 'primereact/menuitem';
import { Badge } from 'primereact/badge';
import { CarAlarmProps } from '../types/Types';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { getFullUrl } from '../Utils/Helper';
import { Token } from '../Utils/constants';
import { Tooltip } from 'primereact/tooltip';
import { Divider } from 'primereact/divider';
import GrowlContext from '../Utils/growlContext';

type AlarmProps ={
    Alarms:Array<CarAlarmProps>
}
  
export const MenuItems = (props:any) => {
    const toast = useRef<Toast>(null);
    const [showAlerts,setShowAlerts] = React.useState(false)
    const [newAlarms,setNewAlarms] = React.useState(Array<CarAlarmProps>())
   
    React.useEffect(()=>{
        const interval = setInterval(async () => {
            axios.get(getFullUrl(`/api/v1/gps/alarmsByCar?carId=${1356089}`),{
                headers:{
                  'Authorization': `Basic ${Token}`
                }
              }).then((res)=>{
                  const x = res.data as Array<CarAlarmProps>
                  const newNotifications = x.filter((n)=> n.isNew === true )
                  setNewAlarms(newNotifications)
        
              }).catch((error)=>{
                console.log("there's a problem")
              })
        },10000)
          return () => clearInterval(interval);
    },[])

    React.useEffect(()=>{
        if(newAlarms.length > 0){
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
            }
        },
       
        {
            label: 'Delete',
            icon: 'pi pi-envelope',
            command: () => {
                // toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
            }
        }
    ];
    return (
        <>
        <Dialog header="New alert - Unit : 1356089" visible={showAlerts} style={{ width: '48vw' }} onHide={() => setShowAlerts(false)}>
                <RenderNotifications Alarms={newAlarms}/>
        </Dialog>
            <div className='floating-menu'>
            <Badge className='notification-badge' value={newAlarms.length}></Badge>
            <Toast ref={toast} />
            <SpeedDial model={items} direction="up" style={{ left: 'calc(50% - 2rem)', bottom: 0 }} />
         </div>
        </>
    )
}

const RenderNotifications:FunctionComponent<AlarmProps> = ({Alarms}) => {
    const growl = React.useContext(GrowlContext)

    const deleteNotification = (alarm:string)=>{
        // /api/v1/gps/markAlarmAsRead?alarmId=70ab03a6-b466-42de-ba1b-bfaedc8c4d84
        axios.post(getFullUrl(`/api/v1/gps/markAlarmAsRead?alarmId=${alarm}`),{},{
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
      <div>
        <Tooltip target=".custom-target-icon"  />
          {
            Alarms.map((x,i)=>
            
            <>
             <div key={i} className= 'notification-popups'>
             <p  data-pr-tooltip="Time"  className='custom-target-icon'>{x.alarmTime}</p>
              <p  data-pr-tooltip="Unit name"  className='custom-target-icon'>{x.machineName}</p>
             
              <p  data-pr-tooltip="Alert"  className='custom-target-icon'>{x.alarDescription}</p>
              <i data-pr-tooltip="Mark as read"  onClick={()=>deleteNotification(x.alarmId)}
                     className="pi pi-thumbs-up custom-target-icon" style={{ fontSize: '1rem',color:"green" }}></i>
              {/* <i data-pr-tooltip="Delete Notification" 
                     className="pi pi-trash custom-target-icon" style={{ fontSize: '1rem',color:"red" }}></i> */}
            </div>
            <Divider />
            </>
            
            )
          }
      </div>
    )
  }