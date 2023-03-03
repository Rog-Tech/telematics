import { Divider } from 'primereact/divider'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { CarAlarmProps } from '../types/Types'
import BarChart from './Charts/barChart'
import Doughnut from './Charts/doughnut'
import Pie from './Charts/pie'
import RowChart from './Charts/rowChart'

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
type CarDto = {
  data :Array<CarAlarmProps>
}
export const Analytics = () => {

  return (
    <>
    {/* <p style={{paddingRight:"20px"}}>All Units</p>
    <Divider />
    <div className='charts-container'>
      <BarChart />
      <Pie />
      <Doughnut />
    </div> */}
    <StyleChartContainer>
      <p>Analytics Coming Soon..</p>
    </StyleChartContainer>
   
    </>
  )
}
