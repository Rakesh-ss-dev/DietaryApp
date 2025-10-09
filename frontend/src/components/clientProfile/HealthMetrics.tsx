import axios from "axios";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";

type data = {
  height: any;
  weight: any;
  bmi: any;
  bmiStatus: any;
  vitamins: {
    vitaminD: any;
    vitaminB12: any;
    iron: any;
  };
  diabetesAndLipidProfile: {
    hba1c: any;
    triglycerides: any;
    hdl: any;
  };
  thyroidAndUricAcid: {
    tsh: any;
    uricAcid: any;
  };
};

type MetricProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
};

const MetricBar = ({ label, value, min, max, unit = "" }: MetricProps) => {
  const percent = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100)
  );
  const isGood = value >= min && value <= max;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span>{label}</span>
        <span>
          {min}-{max} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${isGood ? "bg-success-500" : "bg-error-500"
            }`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p className="text-center text-sm font-medium">
        {value} {unit}
      </p>
    </div>
  );
};

const HealthCard = () => {
  const [healthData, setHealthData] = useState<data | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
    const token = localStorage.getItem("token");
    axios
      .get(`${SERVER_URL}/client/health-metrics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHealthData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (!healthData)
    return (
      <div className="p-4 text-gray-500">Please add the Health Report</div>
    );

  return (
    <ComponentCard title="Present Values">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
        <div className="shadow-md">
          <h2 className="bg-brand-500 text-white p-3">Vitamin & Nutrients</h2>
          <div className="p-6">
            <MetricBar
              label="Vitamin D"
              value={healthData?.vitamins.vitaminD}
              min={30}
              max={50}
              unit="ng/mL"
            />
            <MetricBar
              label="Vitamin B12"
              value={healthData?.vitamins.vitaminB12}
              min={500}
              max={900}
              unit="pg/mL"
            />
            <MetricBar
              label="Iron"
              value={healthData?.vitamins.iron}
              min={30}
              max={300}
              unit="ng/mL"
            />
          </div>
        </div>

        <div className="shadow-md">
          <h2 className="bg-brand-500 text-white p-3">Diabetes & Lipid Profile</h2>
          <div className="p-6">
            <MetricBar
              label="HbA1c"
              value={healthData?.diabetesAndLipidProfile.hba1c}
              min={4}
              max={6.4}
              unit="%"
            />
            <MetricBar
              label="Triglycerides"
              value={healthData?.diabetesAndLipidProfile.triglycerides}
              min={0}
              max={150}
              unit="mg/dL"
            />
            <MetricBar
              label="HDL"
              value={healthData?.diabetesAndLipidProfile.hdl}
              min={40}
              max={80}
              unit="mg/dL"
            />
          </div>
        </div>

        <div className="shadow-md">
          <h2 className="bg-brand-500 text-white p-3">Thyroid & Uric Acid</h2>
          <div className="p-6">
            <MetricBar
              label="TSH"
              value={healthData?.thyroidAndUricAcid.tsh}
              min={0.5}
              max={4.5}
              unit="µIU/mL"
            />
            <MetricBar
              label="Uric Acid"
              value={healthData?.thyroidAndUricAcid.uricAcid}
              min={2.4}
              max={7.0}
              unit="mg/dL"
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default HealthCard;
