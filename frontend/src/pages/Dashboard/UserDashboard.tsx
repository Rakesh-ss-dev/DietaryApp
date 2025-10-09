import HealthMetrics from "../../components/clientProfile/HealthMetrics";
import MetricCharts from "../../components/clientProfile/MetricCharts";


const UserDashboard = () => {
  return <div>
    <div className="flex items-end justify-end">
      <a
        href="/add-report"
        className="px-4 py-2 mb-4 text-right bg-brand-500 text-white rounded hover:bg-brand-700 transition"
      >
        Add Reports
      </a></div>

    <HealthMetrics />
    <MetricCharts />
  </div>;
};

export default UserDashboard;
