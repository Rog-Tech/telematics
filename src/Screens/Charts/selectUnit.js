import * as dc from "dc";
import { ChartTemplates } from "./ChartTemplates";
const countyChartFunc = (divRef, ndx) => {
    const dimension = ndx.dimension((d) => d.carNO);
    const selectChart = dc.selectMenu(divRef);
    selectChart
      .dimension(dimension)
      .group(dimension.group())
      .on("pretransition", (event) => {
        selectChart.select('option[value=""]').remove();
      })
      .title((d) => d.key)
      .controlsUseVisibility(true);
  
    return selectChart;
  };


export const SelectUnitChart = (props) => (
  <ChartTemplates
    chartFunction={countyChartFunc}
    // title="Gender of Financing Recipient"
    name="Select unit to analyze"
  />
);
