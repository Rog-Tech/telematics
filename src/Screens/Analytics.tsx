import { Divider } from 'primereact/divider'
import React from 'react'
import BarChart from './Charts/barChart'
import Doughnut from './Charts/doughnut'
import Pie from './Charts/pie'
import RowChart from './Charts/rowChart'

export const Analytics = () => {
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
