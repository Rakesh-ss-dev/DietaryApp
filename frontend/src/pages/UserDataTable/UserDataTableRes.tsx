import React, { useEffect, useState } from "react";
import UserDataTable from "../../components/datatables/UserDataTable";
import axios from "axios";
import Input from "../../components/form/input/InputField";
import { filterRequests } from "../../utils/search";

// Sample data

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const token = localStorage.getItem("token");
const UserDataTableRes: React.FC = () => {

  const [users, setUsers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const getUsers = async () => {
      const res = await axios(`${SERVER_URL}/auth/users`, config);
      setUsers(res.data.users);
    };
    getUsers();
  }, []);
  useEffect(() => {
    setFilteredRequests(filterRequests(users, searchTerm, ["name", "phone", "city"]));
  }, [searchTerm, users]);

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-gray-400">Coaches</h2>
        <a
          href='/create-coach'
          className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
        >
          Add Coach
        </a>
      </div>
      <div className="w-full mb-4">
        <Input className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search User name or Mobile Number" />
      </div>
      <UserDataTable data={filteredRequests} />
    </div>
  );
};

export default UserDataTableRes;
