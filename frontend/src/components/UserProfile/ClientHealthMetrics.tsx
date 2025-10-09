
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import Badge from "../ui/badge/Badge";

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
interface ClientHealthCardProp {
  userId: any;
}
const ClientHealthCard: React.FC<ClientHealthCardProp> = ({ userId }) => {
  const [healthData, setHealthData] = useState<data | null>(null);
  const [referred, setReferred] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const fetchReferredUsers = async () => {
    try {
      const response = await axiosInstance.get(`payment/referred_users/${userId}`);
      if (response.data) {
        setReferred(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching referred users:", error);
    }
  }
  useEffect(() => {
    axiosInstance
      .get(`payment/health-metrics/${userId}`)
      .then((res) => {
        setHealthData(res.data.latest);
        setUserData(res.data.user);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    fetchReferredUsers();
  }, []);
  if (loading) return <div className="p-4 text-gray-500">Loading.....</div>;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
      <div className="flex gap-4 md:gap-6 mb-6 md:mb-0 md:col-span-3">
        <div className="rounded-2xl shadow-md col-span-full w-1/2">
          <h2 className="bg-brand-500 text-white rounded-t-2xl p-3">
            General Info
          </h2>

          <div className="p-6 flex flex-col md:flex-row justify-between">
            <div>
              <p className="mb-2">Name: {userData?.name}</p>
              <p className="mb-2">Phone: {userData?.phone}</p>
              <p className="mb-2">Package: {userData?.package?.name}</p>

              {userData?.activated_at && <p className="mb-2">Active From: {new Date(userData?.activated_at).toLocaleDateString()}</p>}
            </div>
          </div>

        </div>
        <div className="rounded-2xl shadow-md col-span-full w-1/2">
          <h2 className="bg-brand-500 text-white rounded-t-2xl p-3">
            Referred Users: {referred.length}
          </h2>

          <div className="p-6 flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mt-2">
                {referred.length > 0 &&
                  referred.map((user: any) => <Badge key={user._id}><a href={`${user._id}`}>{user.name}</a></Badge>)}
              </div>

            </div>
          </div>

        </div>
      </div>
      {referred.length > 0 && (
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
          <div className="rounded-2xl shadow-md">
            <h2 className="bg-brand-500 text-white rounded-t-2xl p-3">
              Vitamin & Nutrients
            </h2>
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

          <div className="rounded-2xl shadow-md">
            <h2 className="bg-brand-500 text-white rounded-t-2xl p-3">
              Diabetes & Lipid Profile
            </h2>
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

          <div className="rounded-2xl shadow-md">
            <h2 className="bg-brand-500 text-white rounded-t-2xl p-3">
              Thyroid & Uric Acid
            </h2>
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
        </div>)}
    </div>
  );
};

export default ClientHealthCard;
