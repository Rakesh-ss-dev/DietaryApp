import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import axiosInstance from "../../api/axios";

interface ClientWeightGraphProps {
    userId: any;
}

interface WeightEntry {
    date: string;
    weight: number;
}

const WeightChartOptions = (yTitle: string): ApexOptions => {
    return {
        chart: {
            type: "area",
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: 'Outfit, sans-serif',
        },
        stroke: { curve: "smooth" },
        colors: ["#598D7B"],
        xaxis: {
            type: "category",
            labels: { rotate: -45 },
        },
        yaxis: {
            title: { text: yTitle },
            labels: {
                formatter: (value: number) => value.toFixed(2),
            },
        },
    };
};

// Reusable series builder
const prepareWeightSeries = (data: WeightEntry[]) => {
    return [
        {
            name: "Weight",
            data: data.map((entry) => ({
                x: new Date(entry.date).toLocaleDateString(),
                y: entry.weight,
            })),
        },
    ];
};

const ClientWeightGraph = ({ userId }: ClientWeightGraphProps) => {
    const [weightGraphData, setWeightGraphData] = useState<WeightEntry[]>([]);
    const getWeightGraphData = async () => {
        try {
            const res = await axiosInstance.get(`/payment/getWeightGraphData/${userId}`);
            setWeightGraphData(res.data);
        } catch (error) {
            console.error("Error fetching weight graph data:", error);
        }
    };
    useEffect(() => {
        getWeightGraphData();
    }, [userId]);
    return (
        <ComponentCard title="Daily Weight Report" className="w-full md:w-1/2 m-5">
            <div className="w-full">
                <Chart
                    options={WeightChartOptions("Weight (kg)")}
                    series={prepareWeightSeries(weightGraphData)}
                    type="area"
                    height={300}
                />
            </div>
        </ComponentCard>
    )
}

export default ClientWeightGraph