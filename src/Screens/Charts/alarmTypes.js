import React from "react";
import * as dc from "dc";
import { ChartTemplates } from "./ChartTemplates";
import * as d3 from "d3";

const alarmTypesChartFunc = (divRef, ndx) => {

    const dim = ndx.dimension((d)=>d.alarmType);

    const dimMeasure = dim.group().reduceCount();

    const Chart = dc.pieChart(divRef);

    Chart
    .width(350)
    .height(300)
    .slicesCap(4)
    .innerRadius(70)
    .dimension(dim)
    .group(dimMeasure)
    .legend(dc.legend().highlightSelected(true))
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        })
    });

    return Chart
}

export const AlarmsTypesInformation = (props) => (
    <ChartTemplates chartFunction={alarmTypesChartFunc} title="סוגי אזעקות לפי קטגוריית יחידות" />
);