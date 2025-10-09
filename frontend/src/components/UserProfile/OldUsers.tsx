import axios from "axios";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import { filterRequests } from "../../utils/search";

const OldUsers = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");
  const handleClick = async (id: any) => {
    setLoading(true);
    try {
      await axios.post(
        `${SERVER_URL}/payment/make_active`,
        { id, from: "old" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User Activated");
    } catch (err) {
      console.error("Error making User active:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios(`${SERVER_URL}/payment/get_old_users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.requests) {
          const sortedRequests = [...res.data.requests].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setRequests(sortedRequests);
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
  }, [loading]);
  useEffect(() => {
    setFilteredRequests(filterRequests(requests, searchTerm, ["name", "phone"]));
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
        <p>No Old Users</p>
      </div>
    );

  return (
    <div>
      <div className="flex mt-5 justify-end gap-3 items-center">
        <div className="w-1/3">
          <Input className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search User name or Mobile Number" />
        </div>
      </div>
      <div className="grid grid-cols-1 mt-7 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredRequests.map((request: any) => (
          <UserCard
            key={request._id}
            title={request.name}
            date={request.updatedAt}
            plan={request.package.name}
            reasons={request.reasons}
            city={request.city}
            placeButton={true}
            buttonText={"Activate User"}
            clickFunction={() => handleClick(request._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default OldUsers;
