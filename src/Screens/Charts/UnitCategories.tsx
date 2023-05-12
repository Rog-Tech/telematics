import React, { useEffect, useState,FunctionComponent } from 'react'
import { Chart } from 'primereact/chart';
import { CarProps, ICarInformation } from '../../types/Types';

type CarInformations = {
    info :Array<CarProps>
}
const UnitCategories : FunctionComponent <CarInformations> = ({info}) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const labels = info.map((r)=> {
            return r.machineName
        })
        const arr: number[] = Array.from({ length: labels.length }, () => 1)

        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: labels,
            datasets: [
                {
                    data: arr,
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'), 
                        documentStyle.getPropertyValue('--yellow-500'), 
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--green-100')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'), 
                        documentStyle.getPropertyValue('--yellow-400'), 
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--green-100')
                    ]
                }
            ]
        };
        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

  return (
    <div className="card flex justify-content-center">
    <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-20rem" />
</div>
  )
}

export default UnitCategories