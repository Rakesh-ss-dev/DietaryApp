import { useEffect, useState } from "react";
import axios from "axios";
import HealthReportsDataTable from "../../components/datatables/HealthReportsDataTable";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const HealthReportsList = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(`${SERVER_URL}/client/getRequests`, config);
        setReports(res.data || []);
      } catch (err) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  return (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-gray-400">Reports</h2>
        
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reports.length > 0 ? (
        <HealthReportsDataTable data={reports} />
      ) : (
        <p>No Reports Available</p>
      )}
    </div>
  );
};

export default HealthReportsList;
