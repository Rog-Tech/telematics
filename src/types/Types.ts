import React from 'react'

export interface CarProps {
 accStatus: number,
    accTime: number,
    carId: number,
    dir: number,
    exData:string,
    gateType:string,
    gsmUpdateTime:string,
    lat: number,
    latc: number,
    lon: number,
    lonc: number,
    machineType: number,
    online: number,
    orginalSpeed: number,
    gpsUpdateTime:string,
    pointType: number,
    speed: number,
    staticTime:string,
    status: string
    machineName:string
    power:string
  }

  export interface CarHistoryProps {
    alarm: string,
    altitude: number,
    dir: number,
    exData: string,
    imei: string,
    isStop: boolean,
    lat:number,
    latc: number,
    lon: number,
    lonc: number,
    mileage: number,
    pointDt: string,
    pointType: number,
    remark: string,
    signalMile: number,
    speed: number,
    status: string,
    stopTime: number
  }
  export interface CarDto {
    car:Array<CarHistoryProps>
    animation:boolean
    speed:string
    time:number
    setPopupContent:React.Dispatch<React.SetStateAction<IPopupContent | null | undefined>>
  }
  export interface CarMarkerProps{
      lat: number;
      lng: number;
      dir: number;
      setPopupContent:React.Dispatch<React.SetStateAction<IPopupContent | null | undefined>>
  }
  export interface ICarMarker{
    lat: number;
    lng: number;
    dir: number;
    unitBeing?:CarAlarmProps
}
  export interface CarAnimationProps {
    locationData: Array<CarHistoryProps>;
    showTrack: boolean
    speed:string
    timeline : number
    setPopupContent:React.Dispatch<React.SetStateAction<IPopupContent | null | undefined>>
  }
  export interface LatLng {
    lat: number;
    lng: number;
  }
  export interface PathWithDistance extends LatLng {
    distance: number;
  }
  export interface CarPathLineProps {
    carPath: Array<CarHistoryProps>;
  }

  export interface CarAlarmProps{
    alarmId: string,
    alarmTime: string,
    alarmType:number,
    alarDescription:string,
    carId: number,
    dir: number,
    isNew: true,
    lat: number,
    latC: number,
    lon: number,
    lonC: number,
    machineName: string
    pointTime: string,
    pointType: number,
    remark: string,
    speed: number,
    userId: number,
    userType: number
  }
export interface ICarInformation {
        activeTime: string,
        agentRemark: string,
        carId: number,
        carNO: string,
        carType: number,
        imei: string,
        joinTime: string,
        machineName: string,
        machineType: number,
        platformTime: string,
        remark: string,
        saleTime: string,
        serviceState: number,
        serviceTime: string,
        serviceTimeOrigin: string,
        simNO: string,
        updateTime: string,
        userId: number
}
export interface IPopupContent extends CarProps {
  address: string
}
  // drop downs

export  interface SearchParamsDto {
  name:number;
  code:number
}