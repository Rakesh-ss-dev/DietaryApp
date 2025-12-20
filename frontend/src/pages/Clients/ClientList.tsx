import React, { useEffect, useState } from "react";
import RequestDataTable from "../../components/datatables/RequestsDataTable";
import { filterRequests } from "../../utils/search";
import Input from "../../components/form/input/InputField";
import axiosInstance from "../../api/axios";
import ComponentCard from "../../components/common/ComponentCard";

interface Client {
  name: string;
  phone: string;
  package: {
    name: string;
  };
  trainer: {
    name: string;
  };
  email: string;
  city: string;
  _id: string;
  createdAt: string;
  payed_at: string;
  createdBy?: {
    name: string;
  };
}

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }



    const getRequests = async () => {
      try {
        const res = await axiosInstance.get(`/client/list`);
        setRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, []);
  useEffect(() => {
    setFilteredRequests(filterRequests(requests, searchTerm, ["name", "phone", "city", "email"]));
  }, [searchTerm, requests]);
  return (
    <ComponentCard title="Clients List" {...(user?.accessModule === "Trainer" ? {} : { createLink: '/create-client', createTitle: 'Add Client' })}>
      <div className="max-w-full overflow-x-auto p-4">
        <div className="w-full mb-4">
          <Input className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search User name or Mobile Number" />
        </div>
        {loading ? (
          <p className="text-gray-600">Loading requests...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : requests.length > 0 ? (
          <RequestDataTable data={filteredRequests} />
        ) : (
          <p className="text-gray-600">No requests available</p>
        )}
      </div>
    </ComponentCard >
  );
};

export default RequestList;
