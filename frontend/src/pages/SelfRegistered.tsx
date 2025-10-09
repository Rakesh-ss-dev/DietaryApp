import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import SelfRegisteredTable from "../components/datatables/SelfRegisteredTable";
import { filterRequests } from "../utils/search";
import Input from "../components/form/input/InputField";

type Request = {
    _id: string;
    name: string;
    phone: string;
    city: string;
    createdBy?: {
        name: string;
    };
};

const SelfRegistered = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get("/payment/getSelfRegistered");
            setRequests(response.data.requests);
        } catch (error) {
            console.error("Error fetching self-registered requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []); // fetch once on mount
    useEffect(() => {
        setFilteredRequests(filterRequests(requests, searchTerm, ["name", "phone", "city"]));
    }, [searchTerm, requests]);
    return (
        <div className="p-6">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-full mb-4">
                    <Input className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search User name or Mobile Number" />
                    <SelfRegisteredTable data={filteredRequests} />
                </div>

            )}
        </div>
    );
};

export default SelfRegistered;
