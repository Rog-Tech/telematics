import React from "react";
import * as dc from "dc";
import { ChartTemplates } from "./ChartTemplates";
import * as d3 from "d3";

const sizeChartFunc = (divRef, ndx) => {

    const monthDimension = ndx.dimension((d) => {
        var date = d3.timeParse("%Y-%m-%d %H:%M:%S")(d.pointDt);
        var month = d3.timeFormat("%B")(date);
        return month
    });
    const stopsByMonth = monthDimension.group().reduceSum((d) => d.stopTime/3600);
    var width = 370
    var x = d3.scaleBand().range([0, width]).paddingInner(0.05).paddingOuter(0.05);
    const sizeChart = dc.barChart(divRef);
    sizeChart
    .width(300)
    .height(300)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .xAxisLabel('חודשים')
    .yAxisLabel('משך - שעות')
    .dimension(stopsByMonth)
    .barPadding(0.1)
    .outerPadding(0.05)
    .group(stopsByMonth);

    return sizeChart;
}
export const StopInformation = (props) => (
    <ChartTemplates chartFunction={sizeChartFunc} title="היחידה מפסיקה שעות נוספות" />
);