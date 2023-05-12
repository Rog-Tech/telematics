import React, { FC } from 'react'
import { Marker } from 'react-map-gl'
import { CarHistoryProps, CarStop, IPopup } from '../../types/Types'
import { ReverseGeocodingAPIKey } from '../../Utils/constants'

const Stops:FC<CarStop> = ({carUnits,setPopupContent}) => {
    const stops:any = carUnits.filter((f)=>f.isStop === true)
    const [content,setContent]= React.useState<IPopup | null>();

    React.useEffect(()=>{
    
      if(!content){
        return
      }
      async function fetchData() {
        
        try {
          const response = await fetch(
            `https://eu1.locationiq.com/v1/reverse.php?key=${ReverseGeocodingAPIKey}&lat=${content?.lat}&lon=${content?.lon}&format=json`
          );

            const data = await response.json();
            console.log(data)
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
              alarmTime:content?.alarmTime,
              pointDt:content?.pointDt,
              stopTime:content?.stopTime
            }
            setPopupContent(r)

        } catch (error) {
            console.error(error)
        }
      }
  
      fetchData();
      setPopupContent(content)
    },[content])

  return (
    <>
    {
        stops.map((s:IPopup)=> 
            <Marker  onClick={e => {
                e.originalEvent.stopPropagation();
                setContent(s)
              }} key={s.carId} longitude={s.lon} latitude={s.lat}>
                    <i className="pi pi-spin pi-cog" style={{ fontSize: '1.5rem' ,color:"#007ad9"}}></i>
            </Marker>
        )
    }
    </>
   
  )
}

export default Stops