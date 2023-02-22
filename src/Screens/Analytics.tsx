import { Divider } from 'primereact/divider'
import React, { FunctionComponent } from 'react'
import { CarAlarmProps } from '../types/Types'
import BarChart from './Charts/barChart'
import Doughnut from './Charts/doughnut'
import Pie from './Charts/pie'
import RowChart from './Charts/rowChart'

type CarDto = {
  data :Array<CarAlarmProps>
}
export const Analytics:FunctionComponent<CarDto> = ({data}) => {

  return (
    <>
    <p style={{paddingRight:"20px"}}>All Units</p>
    <Divider />
    <div className='charts-container'>
      <BarChart />
      <Pie />
      <Doughnut />
    </div>
    </>
  )
}
