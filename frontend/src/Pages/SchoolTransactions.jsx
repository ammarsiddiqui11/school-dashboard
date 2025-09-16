import { useState } from "react";
import api from "../Api";

export default function SchoolTransactions() {
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBySchool = async () => {
    if (!schoolId) return alert("Please enter a School ID");
    setLoading(true);
    try {
      const res = await api.get(`/payments/transactions/school/${schoolId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching by school:", err);
      alert("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transactions by School</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter School ID"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={fetchBySchool}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Fetch
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Collect ID</th>
              <th className="p-2">School ID</th>
              <th className="p-2">Order Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Custom Order ID</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{tx.collect_id?._id}</td>
                  <td className="p-2">{tx.collect_id?.school_id}</td>
                  <td className="p-2">{tx.order_amount}</td>
                  <td className="p-2">{tx.status}</td>
                  <td className="p-2">{tx.custom_order_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
