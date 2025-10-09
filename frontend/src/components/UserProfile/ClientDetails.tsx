import ClientMetricCharts from "./ClientMetricCharts";
import ClientHealthCard from "./ClientHealthMetrics";
import { useParams } from "react-router";

const ClientDetails = () => {
    const {userId} =useParams();
  return (
    <div>
      <ClientHealthCard userId={userId} />
      <ClientMetricCharts userId={userId} />
    </div>
  );
};

export default ClientDetails;
