import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { CarAlarmProps, CarHistoryProps, CarProps, ICarInformation } from '../types/Types'
import { TabView, TabPanel } from 'primereact/tabview';
import axios from 'axios';
import { getFullUrl } from '../Utils/Helper';
import WordCloud from './Charts/WordCloud';
import { Divider } from 'primereact/divider'
import crossfilter, { Crossfilter } from 'crossfilter2';
import * as d3 from 'd3';
import UnitCategories from './Charts/UnitCategories';
import { DataContext } from './Charts/cxContext';
import { SelectUnitChart } from './Charts/selectUnit';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import GrowlContext from '../Utils/growlContext';
import { StopInformation } from './Charts/stopBarChart';
import { SpeedInformation } from './Charts/speedLineChart';
import { MileageInformation } from './Charts/miliageLineChart';
import { AlarmsTypesInformation } from './Charts/alarmTypes';
import { AlarmsDescInformation } from './Charts/alarmTypesDesc';

import { ScrollPanel } from 'primereact/scrollpanel';
        
const StyleChartContainer = styled.div`
    top: 6rem;
    right: 0;
    margin: auto;
    position: relative;
    text-align: center;
  p{
      font-size:2rem;
      font-weight:500;
  }
`
const SelectMenu = styled.div`
    display: flex;
    justify-content: flex-end;
    .dropdown-container{
      width:50%;
      margin:3px;
    }
    .calender-container{
      margin:10px;
    }
    .button-inline{
      margin:10px
    }
    .tracks-label-inline{
      margin-right: 5px;
    }

    @media (max-width: 768px) {
      flex-flow:column nowrap;
      align-items:end;
    }

`
const ContainerDiv = styled.div`
  margin-top:5px;

  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    background: #007ad9a6;
    border-color: #fdfdfd;
    color: black;
    font-weight:500;
  }
  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
    border: none;
    /* border-width: 1px; */
    border-color: none;

    background: transparent;

    color: blue;
    padding: 0.857rem 1rem;
    font-weight: 700;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    transition: background-color 0.2s, box-shadow 0.2s;
    margin: 0 0 -1px 0;

    font-weight:300;
  }
`
interface wordProps {
  [words:string] : number
}

type CarDto = {
  data :Array<CarAlarmProps>
}
interface Car {
  name: string;
  code: number;
}
const OverViewContainer = styled.div`
  display:flex;
  justify-content:space-around;
  .wordcount-content{
    border: 1px solid white;
    border-radius: 50%;
    background: antiquewhite;
    overflow: hidden;
    padding:5px;
  }

  @media (max-width: 768px) {
      flex-flow:column nowrap;
      place-items:center;
      overflow-y:auto;
      /* height:100vh; */
      margin-bottom:15px;
  }

`
const StyledDivider = styled(Divider)`
  // Default styling for vertical layout
  display: block;
  height: 100%;
  margin: 0 1rem;
  border-left: 1px solid #d9d9d9;

  // Media query to change layout to horizontal on max-width 768px
  @media (max-width: 768px) {
    display: inline-block;
    width: 100%;
    margin: 1rem 0;
    border-top: 1px solid #d9d9d9;
    border-left: none;
  }
`;
export const Analytics = (props:any) => {
  const usrCtx = JSON.parse( window.localStorage.getItem('refreshToken')!)
  const {name,token} =  usrCtx;
  const [alarms, setAlarms] = React.useState(Array<CarAlarmProps>)
  const [wordCount, setwordCount] = React.useState(Array<{ text: string; value: number }>)
  const [UnitWordCount, setUnitWordCount] = React.useState(Array<{ text: string; value: number }>)
  const [tracks, setTracks] = React.useState<Crossfilter<CarHistoryProps> | null>(null);
  const [alarmsHistory, setAlarmsHistory] = React.useState<Crossfilter<CarAlarmProps> | null>(null);
  const [carInfo, setCarInfo] = React.useState(Array<CarProps>())
  const [selectedCar,setSelectedUnit] = React.useState<Car>();
  const [dropDownOptions,setdropDownOptions] = React.useState(Array<Car>())
  const newDates = [new Date(), new Date()];
  const [dates, setDates] = React.useState<Date[]>(newDates);
  const [isloading, setisloading] = React.useState(false)
  const growl = React.useContext(GrowlContext);

  const countWords = (arr: string[]) => {
    const frequency : wordProps = {};
    arr.forEach((word:string) => {
      frequency[word] = frequency[word] ? frequency[word] + 1 : 1;
    });
    return frequency;
  };


  React.useEffect(()=>{
    if (props.data) {
    
        const d : Car[] = props.data.map((r:CarProps)=>{
          return {
            name:r.machineName + "-" + r.remark, code:r.carId
        }
      })
      setdropDownOptions(d)
      setCarInfo( props.data)
      // const  ndx = crossfilter(props.data)
      // setCx(ndx)
    }
  },[props])

  React.useEffect(()=>{
      if (!token) {
        return
      }
      axios.get(getFullUrl(`/api/v1/gps/alarmsByUser?token=${token}`)).then((res)=>{
        const x = res.data as Array<CarAlarmProps>
        const alarDescriptions = x.map((alarm) => alarm.alarDescription);
        const frequency = countWords(alarDescriptions);
        const words = Object.keys(frequency).map((key) => ({
          text: key,
          value: frequency[key],
        }));
        setwordCount(words)
        setAlarms(x)
      }).catch((error)=>{
        console.log(error)
      })
  },[])

  const getTracks = ()=>{
    setisloading(true)
    
    if(!dates || !selectedCar){
      return
    }

    axios.post(getFullUrl(`/api/v1/gps/carHistory?token=${token}`),{
        carId: selectedCar.code,
        startTime: dates[0].toISOString().slice(0, 19).replace('T', ' '),
        endTime: dates[1].toISOString().slice(0, 19).replace('T', ' ')
      
    }).then((res)=>{
        const d = res.data as Array<CarHistoryProps>
        if(d.length < 1){
            growl.current.show({
              summary:"No record found for this unit",
              severity:"info"
            })
        }
        const s =  d.sort((a, b) => new Date(a.pointDt).getTime() -new Date(b.pointDt).getTime())  
        const  ndx = crossfilter(s)
        setTracks(ndx)
        setisloading(false)

        growl.current.show({
          summary:"Paths loaded successfully",
          severity:'info'
        })

    }).catch((error)=>{
      console.log(error)
    })
  }


  const getAlarms = ()=>{
    setisloading(true)
    
    if(!dates || !selectedCar){
      return
    }

    axios.post(getFullUrl(`/api/v1/gps/carAlarmHistory?token=${token}`),{
        carId: selectedCar.code,
        startTime: dates[0].toISOString().slice(0, 19).replace('T', ' '),
        endTime: dates[1].toISOString().slice(0, 19).replace('T', ' ')
      
    }).then((res)=>{
        const d = res.data as Array<CarAlarmProps>
        if(d.length < 1 ){
            growl.current.show({
              summary:"No alarms found for this unit",
              severity:"info"
            })
            return
        }
        const alarDescriptions = d.map((alarm) => alarm.alarDescription);
          const frequency = countWords(alarDescriptions);
          const words = Object.keys(frequency).map((key) => ({
            text: key,
            value: frequency[key],
          }));
          setUnitWordCount(words)
        const s =  d.sort((a, b) => new Date(a.alarmTime).getTime() -new Date(b.alarmTime).getTime())  
        const  ndx = crossfilter(s)
        setAlarmsHistory(ndx)
        setisloading(false)

        growl.current.show({
          summary:"Alarms loaded successfully",
          severity:'info'
        })

    }).catch((error)=>{
      console.log(error)
    })
  }

    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const handleWindowResize = () => {
        if (window.innerWidth <= 768) {
          setIsMobile(true);
        }
        
      };
      handleWindowResize();
  
      window.addEventListener('resize', handleWindowResize);
      return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

  return (
    <ContainerDiv>
      {props.data ? 
      <TabView activeIndex={1}>
      <TabPanel header="סקירה כללית" leftIcon="pi pi-th-large mr-2">
        <OverViewContainer className="div">
          <div>
            {wordCount.length > 1 ? <div className="wordcount-content">
                 <WordCloud  words={wordCount}/>
            </div> : <p>No alarms for this user</p>}
          </div>
          {isMobile ? <Divider /> : <Divider  layout='vertical'/>}
          
          <div className="div">
          {carInfo && ( <UnitCategories info={carInfo} />)}
          </div>
          {isMobile ? <Divider /> : <Divider  layout='vertical'/>}
          <div className="div">
          {carInfo && ( <UnitCategories info={carInfo} />)}
          </div>
        </OverViewContainer>
      </TabPanel>
      <TabPanel header="עוקב אחר תובנות" leftIcon="pi pi-flag mr-2" >
        <DataContext ndx={tracks}>
          <SelectMenu>
              <div className='dropdown-container'>
                    <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setSelectedUnit(e.value)} options={dropDownOptions} optionLabel="name" placeholder="בחר רכב" 
                  filter   />
              </div>

              <div className='calender-container'>
                <label className='tracks-label-inline'>טווח תאריכים</label>
                <Calendar  value={dates} onChange={(e) => setDates(e.value as Array<Date>)} selectionMode="range" readOnlyInput dateFormat="dd/mm/yy" showIcon />
              </div>
             <div className='button-inline'>
                <Button  icon="pi pi-search" label='שאילתא' onClick={getTracks}/>
             </div>
          </SelectMenu>
          <Divider />
           {tracks && (   <OverViewContainer className="div">
              <div className="div">
              {tracks && ( <StopInformation />)}
              </div>
              {isMobile ? <Divider /> : <Divider  layout='vertical'/>}
              <div className="div">
                {tracks && (<SpeedInformation />)}
              </div>
              {isMobile ? <Divider /> : <Divider  layout='vertical'/>}
              <div className="div">
                  {tracks &&(<MileageInformation />)}
              </div>
            </OverViewContainer>)}
        </DataContext>
      </TabPanel>
      <TabPanel header="תובנות על אזעקות" leftIcon="pi pi-bell mr-2">
        <DataContext ndx={alarmsHistory}>
        <SelectMenu>
              <div className='dropdown-container'>
                    <Dropdown className='tracks-dropdown' value={selectedCar} onChange={(e) => setSelectedUnit(e.value)} options={dropDownOptions} optionLabel="name" placeholder="בחר רכב" 
                  filter   />
              </div>

              <div className='calender-container'>
                <label className='tracks-label-inline'>טווח תאריכים</label>
                <Calendar  value={dates} onChange={(e) => setDates(e.value as Array<Date>)} selectionMode="range" readOnlyInput dateFormat="dd/mm/yy" showIcon />
              </div>
             <div className='button-inline'>
                <Button  icon="pi pi-search" label='שאילתא' onClick={getAlarms}/>
             </div>
          </SelectMenu>
          <Divider />
          <OverViewContainer className="div">
              <div className="div">
                {alarmsHistory &&( <AlarmsTypesInformation />)}
              </div>
              {isMobile ? <Divider /> : <Divider  layout='vertical'/>}
              <div className="alarms-container">
                <p style={{textAlign:"center", marginBottom: "15px"}}>
                אזעקות תכופות
                </p>
               {UnitWordCount && (
                <div className="wordcount-content">
                    <WordCloud words={UnitWordCount}/>
                </div>
               )}
              </div>
              {/* {isMobile ? <Divider /> : <Divider  layout='vertical'/>} */}
              {/* <div className="div">
                 {carInfo && ( <UnitCategories info={carInfo} />)}
              </div> */}
            </OverViewContainer>
        </DataContext>
      </TabPanel>
    </TabView> 
    : <p>Loading data...</p>
      }
        
    </ContainerDiv>
  )
}
