import React from "react";
import * as dc from "dc";
import { ChartTemplates } from "./ChartTemplates";
import * as d3 from "d3";

const mileageChartFunc = (divRef, ndx) => {

    const monthDimension = ndx.dimension((d) => {
        var date = d3.timeParse("%Y-%m-%d %H:%M:%S")(d.pointDt);
        var month = d3.timeFormat("%B")(date);
        return month
    });

    const mileagesByMonth = monthDimension.group().reduceSum((d) => d.mileage /10000);
    var width = 500
    var x = d3.scaleBand().range([0, width]).paddingInner(0.1).paddingOuter(0.3);
    const Chart = dc.lineChart(divRef);
    Chart
    .width(350)
    .height(300)
    .x(x)
    .xUnits(dc.units.ordinal)
    .curve(d3.curveStepBefore)
    .renderArea(true)
    .brushOn(true)
    .renderDataPoints(true)
    .clipPadding(10)
    .yAxisLabel("מִספָּר הַמַיִלִים")
    .dimension(monthDimension)
    .group(mileagesByMonth);

    return Chart;
}

export const MileageInformation = (props) => (
    <ChartTemplates chartFunction={mileageChartFunc} title="שעות נוספות קילומטראז" />
);