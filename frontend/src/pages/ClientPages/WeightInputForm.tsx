import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import { Box } from "@mui/material";
import CircularSlider from "@fseehawer/react-circular-slider";
import Button from "../../components/ui/button/Button";
import axios from "axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

interface WeightEntry {
    date: string;
    weight: number;
}

const chartOptions = (yTitle: string): ApexOptions => {
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
const prepareSeries = (data: WeightEntry[]) => {
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

const WeightInputForm = () => {
    const [value, setValue] = useState(75);
    const decimalSteps = Array.from({ length: 1601 }, (_, i) => (40 + i * 0.1).toFixed(1));
    const [graphData, setGraphData] = useState<WeightEntry[]>([]);

    const token = localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchData = async () => {
        try {
            const res = await axios.get<WeightEntry[]>(`${SERVER_URL}/client/weights/`, config);
            setGraphData(res.data);
        } catch (err) {
            console.error("Error fetching weight data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                `${SERVER_URL}/client/weight/submit`,
                { weight: value },
                config
            );
            if (response.status === 201) {
                alert("Weight submitted successfully!");
                fetchData();
            } else {
                alert("Failed to submit weight.");
            }
        } catch (error) {
            console.error("Error submitting weight:", error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <ComponentCard title="Daily Weight Input" className="!p-4 w-full md:w-1/2 lg:w-1/3">
                <Box className="knob flex flex-col items-center">
                    <CircularSlider
                        label="kg"
                        labelColor="#005a58"
                        knobColor="#005a58"
                        progressColorFrom="#4F7E6F"
                        progressColorTo="#1D3833"
                        progressSize={20}
                        trackColor="#ACC5BC"
                        labelBottom={true}
                        trackSize={20}
                        data={decimalSteps}
                        dataIndex={Math.round((value - 40) * 10)} // 0.1 precision → multiply by 10
                        onChange={(val:any) => setValue(parseFloat(val))}
                        knobSize={35}
                        knobPosition="bottom"
                    />

                    <Button size="sm" className="mt-4" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </ComponentCard>

            <ComponentCard title="Daily Weight Report" className="w-full md:w-2/3">
                <div className="w-full">
                    <Chart
                        options={chartOptions("Weight (kg)")}
                        series={prepareSeries(graphData)}
                        type="area"
                        height={300}
                    />
                </div>
            </ComponentCard>
        </div>
    );
};

export default WeightInputForm;
