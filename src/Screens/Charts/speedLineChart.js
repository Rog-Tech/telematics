import React from "react";
import * as dc from "dc";
import { ChartTemplates } from "./ChartTemplates";
import * as d3 from "d3";

const speedChartFunc = (divRef, ndx) => {

    const monthDimension = ndx.dimension((d) => {
        var date = d3.timeParse("%Y-%m-%d %H:%M:%S")(d.pointDt);
        var month = d3.timeFormat("%B")(date);
        return month
    });
    const speedByMonth = monthDimension.group().reduceSum((d) => d.speed / 100);


    const chart= dc.lineChart(divRef);
    var width = 500
    var x = d3.scaleBand().range([0, width]).paddingInner(0.1).paddingOuter(0.3);
    chart
        .width(350)
        .height(300)
        .x(x)
        .xUnits(dc.units.ordinal)
        .curve(d3.curveStepBefore)
        .renderArea(true)
        .brushOn(true)
        .renderDataPoints(true)
        .clipPadding(10)
        .yAxisLabel("מהירות * 100 - m/s")
        .dimension(monthDimension)
        .group(speedByMonth);

    return chart;
}
export const SpeedInformation = (props) => (
    <ChartTemplates chartFunction={speedChartFunc} title="מהירות יחידה שעות נוספות" />
);