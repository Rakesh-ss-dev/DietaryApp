import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import axiosInstance from "../../api/axios";

interface SugarEntries {
    date: string,
    fastingValue: number,
    randomValue: number,
}

const sugarChartOptions = (yTitle: string): ApexOptions => {
    return {
        chart: {
            type: "area",
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: "Outfit, sans-serif",
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        colors: ["#598D7B", "#FF7F50"],
        xaxis: {
            type: "datetime",
            labels: {
                rotate: -45,
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MMM \'yy',
                    day: 'dd MMM',
                },
            },
        },
        yaxis: {
            title: {
                text: yTitle,
                style: {
                    fontWeight: 600,
                },
            },
            labels: {
                formatter: (value: number) => value.toFixed(2),
            },
        },
        tooltip: {
            x: {
                format: "dd MMM yyyy",
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
        },
    };
};


const prepareSugarSeries = (data: SugarEntries[]) => {
    const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return [
        {
            name: "Fasting Sugar",
            data: sorted.map((entry) => ({
                x: new Date(entry.date),
                y: entry.fastingValue,
            })),
        },
        {
            name: "Random Sugar",
            data: sorted.map((entry) => ({
                x: new Date(entry.date),
                y: entry.randomValue,
            })),
        },
    ];
};
interface ClientSugarGraphProps {
    userId: any;
}
const ClientSugarGraph = ({ userId }: ClientSugarGraphProps) => {
    const [sugarValues, setSugarValues] = useState<SugarEntries[]>([])
    const fetchSugarData = async () => {
        try {
            const res = await axiosInstance.get(`/payment/getSugarData/${userId}`);
            setSugarValues(res.data);
        } catch (error) {
            console.error("Error fetching sugar data:", error);
        }
    };
    useEffect(() => {
        fetchSugarData();
    }, [userId]);
    return (
        <ComponentCard title="Daily Sugar Report" className="w-full md:w-1/2 m-5">
            <div className="w-full">
                <Chart
                    options={sugarChartOptions("Sugar Level (mg/dL)")}
                    series={prepareSugarSeries(sugarValues)}
                    type="area"
                    height={300}
                />
            </div>
        </ComponentCard>
    )
}

export default ClientSugarGraph