import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../../components/ui/button/Button";
import formatReadableDateTime from "../../utils/formateDateTime";
import { filterRequests } from "../../utils/search";
import Input from "../../components/form/input/InputField";

// Define the shape of an installment object
interface Installment {
  _id: string;
  name: string;
  amount: number;
  dueAmount: number;
  payed_at: string;
  phone: string;
  city: string;
}


const PendingInstallment = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const sendRequest = async (id: string, dueAmount: number) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/payment/request-installment`,
        {
          id,
          dueAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Payment link sent to your number" + " " + response.data?.payment_link);
    } catch (err) {
      alert("Failed to generate payment link");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/payment/get-installments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const installmentsData: Installment[] = response.data?.installments || [];

        // ✅ Sort descending by created date (latest first)
        const sortedData = installmentsData.sort((a, b) => {
          const dateA = new Date(a.payed_at).getTime();
          const dateB = new Date(b.payed_at).getTime();
          return dateB - dateA; // descending order
        });

        setInstallments(sortedData);
      } catch (err) {
        console.error("Error fetching installments:", err);
        setError("Failed to fetch installments.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstallments();
  }, [SERVER_URL, token]);
  useEffect(() => {
    setFilteredRequests(filterRequests(installments, searchTerm, ["name", "phone", "city"]));
  }, [searchTerm, installments]);
  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pending Installments</h2>
      {installments.length === 0 ? (
        <p className="text-gray-500">No pending installments.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="w-full mb-4">
            <Input className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search User name or Mobile Number" />
          </div>
          <table className="min-w-full text-center shadow-md rounded-lg overflow-hidden">
            <thead className="bg-brand-500 text-gray-700">
              <tr className="text-white text-sm font-medium">
                <th className="px-6 py-3 ">Name</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Paid Amount</th>
                <th className="px-6 py-3">Due Amount</th>
                <th className="px-6 py-3">Paid At</th>

                <th className="px-6 py-3">Request Pending Installment</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((item) => {
                return (
                  <tr
                    key={item._id}
                    className="border-b text-sm text-gray-600 hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 ">{item.name}</td>
                    <td className="px-6 py-4">
                      {item.package?.amount
                        ? (
                          (item.package.amount - (item.package.amount * (Number(item.discount ?? 0) / 100))) +
                          ((item.package.amount - (item.package.amount * (Number(item.discount ?? 0) / 100))) * item.tax)
                        ).toFixed(2)
                        : "—"}
                    </td>
                    <td className="px-6 py-4">{item.amount}</td>
                    <td className="px-6 py-4">{item.dueAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {formatReadableDateTime(item.payed_at)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Button
                        onClick={() => sendRequest(item._id, item.dueAmount)}
                      >
                        Send Request
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingInstallment;
