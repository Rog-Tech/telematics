import React from 'react'

export interface CarProps {
    carId: number,
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
  }
  export interface CarMarkerProps{
      lat: number;
      lng: number;
      dir: number;
  }
  export interface CarAnimationProps {
    locationData: Array<CarHistoryProps>;
    showTrack: boolean
    speed:string
    timeline : number
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
  // drop downs

  export  interface SearchParamsDto {
    name:number;
    code:number
  }