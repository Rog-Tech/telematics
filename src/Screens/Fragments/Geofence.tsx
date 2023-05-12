import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel'
import {MultiSelect, MultiSelectChangeEvent} from 'primereact/multiselect'
import React from 'react'
import styled from 'styled-components';
import { CarProps, Fence } from '../../types/Types';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import axios from 'axios';
import { getFullUrl } from '../../Utils/Helper';
import GrowlContext from '../../Utils/growlContext';
import { Chip } from 'primereact/chip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import GoefenceIcon from '../../assets/Geofence.svg'
import CarSmall  from '../../assets/carSmall.png';


interface Car {
  name: string;
  code: string;
}
export interface FenceDropDownOptions extends Fence{
  name: string;
}
interface DropdownOptions{
  name: string;
  code :string;
}
interface IActions{
  name: string;
  code: string;
}
interface GPSData {
  gpsSystem: "WHATSGPS";
  fence: Fence[];
}
const GeofenceItems = styled.div`
  display:flex;
  justify-content:space-between;
  margin-top:1rem;
  font-size: 12px;
  font-weight: 600;
  p{
    display:grid;
    text-align:center;
    i{
      margin:auto;
    }
  }

`
const ButtonContainer = styled.div`
  margin-top:1rem;
  button{
    border-radius:20px;
    margin-right:15px;
  }
`
const PanelContent = styled.div`
  height:22rem;
  overflow-y:auto;
  margin-bottom:5px;
`
export const Geofence = (props:any) => {
  const growl = React.useContext(GrowlContext);
  const [selectedGeofence, setSelectedGeofence] = React.useState<Array<FenceDropDownOptions> | null>();
  const [units, setSelUnits] = React.useState<Array<Car> | null>();

  const [selectedActions,setSelectedactions] = React.useState<IActions>();

  const [unitsOptions,setUnitsOptions] = React.useState(Array<Car>())

  const [carFenceOPtions,setcarFenceOPtions] = React.useState(Array<Fence>())

  const [fences, setFences] = React.useState<Fence[]>([]);

  const [showOnMap,setseShowOnMap] = React.useState(false)
  const [del,setDel] = React.useState(false)
  const [edit,seteEdit] = React.useState(false)

  const actions : IActions [] =[
    { name: 'unboundCarsFromFence', code: 'unboundCarsFromFence' },
    { name: 'unboundFencesFromCar', code: 'unboundFencesFromCar' },
    { name: 'bindFencesToCar', code: 'bindFencesToCar' },
    { name: 'bindCarsToFence', code: 'bindCarsToFence' },
  ]
 
  
  React.useEffect(() => {
    if (props.data) {
      const d : Car[] = props.data.map((r:CarProps)=>{
        return {
          name:r.machineName + "-" + r.remark, code:r.carId
        }
    }) 
    // setstartTime() 
    setUnitsOptions(d)
    }
   
  }, [props.data])

  React.useEffect(() => {
      
  }, [selectedGeofence])
  

  const  editGeofence = (r:Fence)=>{
    props.setSelectedGeofence(r)
    props.setshowGeofence(true)
  }

  React.useEffect(()=>{
    axios.get(getFullUrl(`/api/v1/gps/getFences?token=${props.token}`)).then((res)=>{
        const d = res.data as Array<GPSData>
        for (const gpsData of d) {
          setFences([...gpsData.fence]);
        }
    }).catch((error)=>{
        console.log(error)
    })
  },[])

  const Geofence = (operation:string)=>{
      const ids = units?.map((i)=> {
        return i.code
      })
      const carFenseIds = carFenceOPtions.map((f)=>{
        return f.carFenceId
      })
    switch (operation) {
      case "bindFencesToCar":
          if(ids && ids?.length > 1){
               growl.current.show({
              summary: "Binding fences to car only works with one car selection",
              severity:"error"
              
             })
             return
          }
          axios.post(getFullUrl(`/api/v1/gps/bindFencesToCar?token=${props.token}`),{
            carId: ids?.at(0),
            carFencesId:carFenseIds
          }).then((res)=>{
            growl.current.show({
              summary: `The unit has been binded successfully `,
              severity:"success"
            })
          }).catch((error)=>{
            growl.current.show({
              summary: "Could not perform the operation",
              severity:"error"
            })
          })
        break;
      case "bindCarsToFence":
        if(carFenseIds && carFenseIds?.length > 1){
          growl.current.show({
              summary: "Binding cars to fence only works with one fence selection",
              severity:"error"
          })
          return
        }
        axios.post(getFullUrl(`/api/v1/gps/bindCarsToFence?token=${props.token}`),{
          carFenceId: carFenseIds.at(0),
            carsId: ids
        }).then((res)=>{
          growl.current.show({
            summary: "The units have added successfully",
            severity:"success"
          })
        }).catch((error)=>{
          growl.current.show({
            summary: "Could not perform the operation",
            severity:"error"
          })
        })
        break; 
      case "unboundFencesFromCar":
          if(ids && ids?.length > 1){
            growl.current.show({
              summary: "you can only unbound one car",
              severity:"error"
           })
             return
          }
          axios.post(getFullUrl(`/api/v1/gps/unboundFencesFromCar?token=${props.token}`),{
            carId: ids?.at(0),
            carFencesId: carFenseIds
          }).then((res)=>{
            growl.current.show({
              summary: "Success, you have removed the fence from the unit",
              severity:"success"
            })
          }).catch((error)=>{
            growl.current.show({
              summary: "Could not perform the operation",
              severity:"error"
            })
          })
          break;   
      case "unboundCarsFromFence":
            if(carFenseIds && carFenseIds?.length > 1){
              growl.current.show({
                  summary: "Un-bounding cars from  fence  only works with one fence selection",
                  severity:"error"
              })
              return
            }
          axios.post(getFullUrl(`/api/v1/gps/unboundCarsFromFence?token=${props.token}`),
            {
              carFenceId: carFenseIds.at(0),
              carsId: ids
            }
          ).then((res)=>{
            growl.current.show({
              summary: "Success, you have removed the units from the fence",
              severity:"success"
            })
          }).catch((error)=>{
            growl.current.show({
              summary: "Could not perform the operation",
              severity:"error"
            })
          })
          break;  
      default:
        break;
    }
  }

  const deleteFence = (id:number) => {
    const accept = () =>{
      axios.post(getFullUrl(`/api/v1/gps/deleteFence?fenceId=${id}&token=${props.token}`)).then((r)=>{
        growl.current.show({
          severity:"success",
          summary: 'Fence has been deleted successfully'
        })

        const carFenceId  = r.data
        const x = selectedGeofence?.filter((y)=>y.carFenceId !==id)
        const filteredFence = fences.filter((d)=>d.carFenceId !== id)

        setFences(filteredFence)
        setSelectedGeofence(x)

    }).catch((error)=>{
      growl.current.show({
        severity:"error",
        summary: 'Failed, could not delete the the fence'
      })
    })
    }
    confirmDialog({
        message: 'האם ברצונך למחוק את הרשומה הזו?',
        header: 'מחק אישור',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger',
          accept,
          // reject
      });
  };
  
  return (
    <>
        <ConfirmDialog />
        <Panel header="גדרות גיאוגרפיות" toggleable className='tracks-panel'>
            <>
            <div className="card flex justify-content-center">
            <MultiSelect value={selectedGeofence} onChange={(e: MultiSelectChangeEvent) => setSelectedGeofence(e.value)} options={fences} optionLabel={'name'}
                placeholder="Select Geo fence" maxSelectedLabels={3} className="w-full md:w-full tracks-dropdown" />
          </div>
          <PanelContent>
            {selectedGeofence && 
              selectedGeofence?.map((x:Fence)=>
                <GeofenceItems>
                  <p>
                  <strong>Name</strong>
                  {x.name}
                </p>
                <p>
                  <strong>Geofence ID</strong>
                  {x.carFenceId}
                </p>
                <p>
                  <strong>Radius</strong>
                  {x.radius}
                </p>
                <p>
                  <i className="pi pi-file-edit" style={{ color: 'slateblue' }} onClick={()=> editGeofence(x)}></i>
                </p>
                {/* <p>
                    <i className="pi pi-map-marker" style={{ color: 'green',marginRight:'10px' }} ></i>
                </p> */}
                <p>
                    <i onClick={()=> deleteFence(x.carFenceId)} className="pi pi-trash" style={{ color: 'green',marginRight:'10px' }}></i>
                </p>
               
              </GeofenceItems>
              )
            }
           </PanelContent>
          </>
        </Panel>
        
        <Panel header="פעולות גדר גיאו" toggleable className='tracks-panel'>
         <>
            <PanelContent>
         <Dropdown className='tracks-dropdown' value={selectedActions} onChange={(e) => setSelectedactions(e.value)} options={actions} optionLabel="name" placeholder="פעולה" 
            filter   />  
          {
            selectedActions && (<Chip label={selectedActions.name} style={{margin:"10px"}}/>)
          }
         {/* <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setSelectedUnit(e.value)} options={unitsOptions} optionLabel="name" placeholder="אוטו" 
            filter   /> */}

          <MultiSelect value={units} onChange={(e: MultiSelectChangeEvent) => setSelUnits(e.value)} options={unitsOptions} optionLabel={'name'}
                placeholder="אוטו" maxSelectedLabels={3} className="w-full md:w-full tracks-dropdown" style={{marginTop:"10px"}}/>

           {units && units.map((r,i)=> <Chip key={i} label={r.name} style={{margin:"10px"}} image = {CarSmall}/>)} 

          <MultiSelect value={carFenceOPtions} onChange={(e: MultiSelectChangeEvent) => setcarFenceOPtions(e.value)} options={fences} optionLabel={'name'}
                placeholder="גדר גיאוגרפית" maxSelectedLabels={3} className="w-full md:w-full tracks-dropdown" style={{marginTop:"10px"}}/>

          {carFenceOPtions && carFenceOPtions.map((r,i)=> <Chip key={i} label={r.name} style={{margin:"10px"}} image = {GoefenceIcon}/>)} 

         <ButtonContainer>
           <Button  onClick={()=> Geofence(selectedActions?.name as string)} label='Apply ' />
         </ButtonContainer>
         </PanelContent>
         </>
        </Panel>
    </>
  )
}
