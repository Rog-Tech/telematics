import React from "react";
import * as dc from "dc";
import { ChartTemplates } from "./ChartTemplates";
import * as d3 from "d3";

const alarmDescChartFunc = (divRef, ndx) => {

   // Create dimension for alarm type
    var alarmTypeDimension = ndx.dimension(function(d) {
        return d.alarmType;
    });
    // Create dimension for alarm description
    var alarmDescDimension = ndx.dimension(function(d) {
        return d.alarDescription;
    });

    // Create group for alarm type
    var alarmTypeGroup = alarmTypeDimension.group().reduceCount();

    // Create group for alarm description
    var alarmDescGroup = alarmDescDimension.group().reduceCount();

    const Chart = dc.barChart(divRef);
    // Set x-axis to alarm type dimension
    Chart.x(d3.scaleOrdinal)
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .dimension(alarmTypeDimension);

    // Set y-axis to count of alarms
    Chart.yAxis().ticks(10);
    Chart.yAxisLabel("Number of Alarms");

    Chart.group(alarmDescGroup, "Description 1")
     .stack(alarmDescGroup, "Description 2")
     .stack(alarmDescGroup, "Description 3")
     .title(function(d) {
         return d.key + ": " + d.value;
     });

    return Chart
}

export const AlarmsDescInformation = (props) => (
    <ChartTemplates chartFunction={alarmDescChartFunc} title="Alarm types by unit category" />
);