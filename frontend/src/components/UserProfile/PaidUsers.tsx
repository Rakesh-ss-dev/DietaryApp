import axios from "axios";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { ChartSpline } from "lucide-react";
import Input from "../form/input/InputField";
import { filterRequests } from "../../utils/search";

const PaidUsers = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");
  const handleClick = async (id: any) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${SERVER_URL}/payment/deactivate_user`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Error making User active:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios(`${SERVER_URL}/payment/get_paid_users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.requests) {
          const sortedRequests = [...res.data.requests].sort(
            (a, b) => new Date(b.payed_at).getTime() - new Date(a.payed_at).getTime()
          );
          setRequests(sortedRequests);
          setFilteredRequests(sortedRequests);
        } else {
          console.warn("Unexpected response format:", res.data);
          setRequests([]);
        }
      } catch (err) {
        console.error("Error fetching paid users:", err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [SERVER_URL, token]); // ✅ FIXED

  useEffect(() => {
    setFilteredRequests(filterRequests(requests, searchTerm, ["name", "phone", "city"]));
  }, [searchTerm, requests]);

  if (loading)
    return (
      <div className="p-5">
        <p>Requests Loading</p>
      </div>
    );

  if (requests.length === 0)
    return (
      <div className="p-5">
        <p>No Paid Users</p>
      </div>
    );

  return (
    <div>
      <div className="flex mt-5 justify-end gap-3 items-center">
        <div className="w-1/3">
          <Input className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search User name or Mobile Number" />
        </div>
      </div>
      <div className="grid grid-cols-1 mt-7 items-stretch auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredRequests.map((request: any) => (
          <div key={request._id} className="relative h-full">
            <UserCard
              title={request.name}
              date={request.payed_at}
              plan={request.package.name}
              reasons={request.reasons}
              placeButton={true}
              city={request.city}
              buttonText={"Deactivate User"}
              clickFunction={() => handleClick(request._id)}
            />
            <div className="absolute bottom-5 right-5">
              <a
                href={`/client-details/${request._id}`}
                className="group block p-2 rounded-full bg-brand-500 shadow-md text-theme-500 hover:bg-brand-100 transition"
              >
                <ChartSpline className="w-6 h-6 text-white group-hover:text-brand-600" />
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PaidUsers;
