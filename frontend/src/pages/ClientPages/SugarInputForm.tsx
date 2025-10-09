import { useEffect, useState } from "react";
import CircularSlider from "@fseehawer/react-circular-slider";
import { Box } from "@mui/material";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import axios from "axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
interface SugarEntries {
  date: string,
  fastingValue: number,
  randomValue: number,
}
const SugarInputForm = () => {
  const [fastingValue, setFastingValue] = useState(120);
  const [sugarValues, setSugarValues] = useState<SugarEntries[]>([])
  const [value, setValue] = useState(120);
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const res = await axios.get<SugarEntries[]>(`${SERVER_URL}/client/sugar-values/`, config);
      setSugarValues(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching weight data", err);
    }
  };
  useEffect(() => {
    fetchData()
  }, [])

  const chartOptions = (yTitle: string): ApexOptions => {
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


  const prepareSeries = (data: SugarEntries[]) => {
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


  const handleFastSubmit = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/client/fastingSugar/submit`, {
        fastingValue: fastingValue,
      }, config);
      if (response.status === 201) {
        alert("Fasting Sugar submitted successfully!");
        fetchData();
      } else {
        alert("Failed to submit weight.");
      }
    } catch (error) {
      console.error("Error submitting weight:", error);
    }
  }
  const handleRandomSubmit = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/client/randomSugar/submit`, {
        randomValue: value,
      }, config);
      if (response.status === 201) {
        alert("Random Sugar submitted successfully!");
        fetchData();
      } else {
        alert("Failed to submit weight.");
      }
    } catch (error) {
      console.error("Error submitting weight:", error);
    }
  }
  return (
    <div className="flex flex-col md:flex-row gap-3 flex-wrap items-center justify-around h-full">
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-2/3">
      <ComponentCard title="Fasting Blood Sugar Level" className="!p-4 w-full md:w-1/2 lg:w-1/2">
        <Box className="flex flex-col items-center">
          <CircularSlider
            label="mg/dL"
            labelColor="#005a58"
            knobColor="#005a58"
            progressColorFrom="#4F7E6F"
            progressColorTo="#1D3833"
            progressSize={20}
            trackColor="#ACC5BC"
            trackSize={20}
            min={40}
            max={450}
            dataIndex={fastingValue - 40}
            onChange={(val: any) => setFastingValue(val)}
            knobSize={35}
            knobPosition="bottom"
            labelBottom={true}
          />
          <Button size="sm" className="mt-4" onClick={handleFastSubmit}>
            Submit
          </Button>
        </Box>
      </ComponentCard>
      <ComponentCard title="Regular Blood Sugar Level" className="!p-4 w-full md:w-1/2 lg:w-1/2">
        <Box className="flex flex-col items-center">
          <CircularSlider
            label="mg/dL"
            labelColor="#005a58"
            knobColor="#005a58"
            progressColorFrom="#4F7E6F"
            progressColorTo="#1D3833"
            progressSize={20}
            trackColor="#ACC5BC"
            trackSize={20}
            min={40}
            max={450}
            dataIndex={value - 40}
            onChange={(val: any) => setValue(val)}
            knobSize={35}
            knobPosition="bottom"
            labelBottom={true}
          />
          <Button size="sm" className="mt-4" onClick={handleRandomSubmit}>
            Submit
          </Button>
        </Box>
      </ComponentCard>
      </div>
      <ComponentCard title="Daily Diabetes Progress" className="w-full md:w-2/3">
                <div className="w-full">
                    <Chart
                        options={chartOptions("Diabetes")}
                        series={prepareSeries(sugarValues)}
                        type="area"
                        height={300}
                    />
                </div>
            </ComponentCard>
    </div>
  );
};

export default SugarInputForm;
