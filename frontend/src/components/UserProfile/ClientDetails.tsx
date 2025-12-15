import ClientMetricCharts from "./ClientMetricCharts";
import ClientHealthCard from "./ClientHealthMetrics";
import { useParams } from "react-router";

const ClientDetails = () => {
  const { clientId } = useParams();
  return (
    <div>
      <ClientHealthCard userId={clientId} />
      <ClientMetricCharts userId={clientId} />
    </div>
  );
};

export default ClientDetails;
