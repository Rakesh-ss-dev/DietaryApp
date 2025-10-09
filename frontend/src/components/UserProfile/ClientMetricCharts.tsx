import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ClientSugarGraph from "../charts/ClientSugarGraph";
import ClientWeightGraph from "../charts/ClientWeightGraph";
import axiosInstance from "../../api/axios";

// Data structure from server
interface HealthData {
  date: string;
  vitamins: {
    vitaminD: number;
    vitaminB12: number;
    iron: number;
  };
  diabetesAndLipidProfile: {
    hba1c: number;
    triglycerides: number;
    hdl: number;
  };
  thyroidAndUricAcid: {
    tsh: number;
    uricAcid: number;
  };
}

// Optimal range type
type Range = { min?: number; max?: number };

// Optimal value definitions
const optimalRanges: Record<string, Range> = {
  "vitamins.vitaminD": { min: 30, max: 50 },
  "vitamins.vitaminB12": { min: 500, max: 900 },
  "vitamins.iron": { min: 15, max: 300 },
  "diabetesAndLipidProfile.hba1c": { max: 5.7 },
  "diabetesAndLipidProfile.triglycerides": { max: 150 },
  "diabetesAndLipidProfile.hdl": { min: 40 }, // Note: could be refined by gender
  "thyroidAndUricAcid.tsh": { min: 0.5, max: 4.5 },
  "thyroidAndUricAcid.uricAcid": { min: 2.4, max: 7.0 },
};

// Chart metadata for rendering
const chartConfigs = [
  { title: "Vitamin D", unit: "ng/mL", path: "vitamins.vitaminD" },
  { title: "Vitamin B12", unit: "pg/mL", path: "vitamins.vitaminB12" },
  { title: "Iron", unit: "ng/mL", path: "vitamins.iron" },
  { title: "HbA1c", unit: "%", path: "diabetesAndLipidProfile.hba1c" },
  {
    title: "Triglycerides",
    unit: "mg/dL",
    path: "diabetesAndLipidProfile.triglycerides",
  },
  { title: "HDL", unit: "mg/dL", path: "diabetesAndLipidProfile.hdl" },
  { title: "TSH", unit: "µIU/mL", path: "thyroidAndUricAcid.tsh" },
  { title: "Uric Acid", unit: "mg/dL", path: "thyroidAndUricAcid.uricAcid" },
];

// Generate ApexChart options
const chartOptions = (

  yTitle: string,
  path: string
): ApexOptions => {
  const range = optimalRanges[path];

  return {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
    },

    colors: ["#598D7B"],
    xaxis: { type: "category", labels: { rotate: -45 } },
    yaxis: {
      title: { text: yTitle },
      labels: {
        formatter: (value) => {
          return value.toFixed(2);
        },
      },
    },
    annotations: range
      ? {
        yaxis: [
          {
            y: range.min,
            y2: range.max,
            borderColor: "#9d2512ff",
            fillColor: "rgba(44, 122, 96, 0.8)",
            label: {
              text: "Optimal Range",
              style: {
                color: "#00E396",
                background: "transparent",
              },
            },
          },
        ],
      }
      : {},
  };
};

// Prepare chart series data
const prepareSeries = (data: HealthData[], path: string) => {
  const keys = path.split(".");
  return [
    {
      name: keys[keys.length - 1],
      data: data.map((entry) => {
        let value: any = entry;
        keys.forEach((k) => {
          value = value?.[k];
        });
        return {
          x: new Date(entry.date).toLocaleDateString(),
          y: value,
        };
      }),
    },
  ];
};

interface ClientMetricChartProp {
  userId: any;
}
const ClientMetricCharts: React.FC<ClientMetricChartProp> = ({ userId }) => {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/payment/getRequests/${userId}`)
      .then((res) => {
        if (Array.isArray(res.data.requests)) {
          setHealthData(res.data.requests);
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading charts...</p>;
  return (
    <div className="">
      <div className="flex">

        <ClientWeightGraph userId={userId} />
        <ClientSugarGraph userId={userId} />
      </div>
      <h2 className="my-5 text-center">Individual Property Graphs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
        {chartConfigs.map(({ title, unit, path }) => (
          <div key={path} className="rounded-2xl shadow-md bg-white">
            <p className="bg-brand-500 text-white rounded-t-2xl p-3">{title}</p>
            <div className="p-6">
              <ReactApexChart
                options={chartOptions(unit, path)}
                series={prepareSeries(healthData, path)}
                type="line"
                height={200}
              />
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export default ClientMetricCharts;
