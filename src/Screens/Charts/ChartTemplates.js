import React from 'react'
import styled from 'styled-components'
import dc from 'dc'
import {CXContext} from './cxContext'

const  Span = styled.span`
    padding:15px;
    display:inline;
    cursor: pointer;
    float:right;
    margin-left:0.5rem;
    
`
const ResetButton = (props)=>{
    return(
        <Span onClick={()=>{
            props.chart.filterAll();
            dc.redrawAll();
        }}>
            reset
        </Span>
    )
}
const ChartContainer = styled.div`
    width: auto;
    height:auto;
    box-sizing:border-box;
    padding-top: 5px;
    text-align:center;
    display:grid;

    h6{
        float: left;
        font-size: 15px;
        padding-right: 0.4rem;
        font-weight: 400;
        color: blue;
    }
    svg {
        width:23rem;
    }
    text{
        font-size:0.9rem

    }
    select{
        width: 21.4rem;
        color: #118AAA;
        height: 2rem;
        border-radius: 10px;
        padding:2px;
    }
    label{
        margin-bottom:15px;
    }
    @media (max-width: 768px) {
        svg{
            width:100%;
        }
  }
`
export const ChartTemplates = (props) => {
    const context = React.useContext(CXContext);
    const [chart, updateChart] = React.useState(null);
    const ndx = context.ndx;
    const div = React.useRef(null);
    React.useEffect(() => {
        const newChart = props.chartFunction(div.current, ndx); // chartfunction takes the ref and does something with it
        newChart.render();
        updateChart(newChart);
      }, [1]);
  return (
    <ChartContainer ref={div}>
        <span>
             <h6>{props.name}</h6>
        </span>
        <label>{props.title}</label>
    </ChartContainer>
  )
}


