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

  const renderCollectId = (collect) => {
    if (!collect) return "-";
    if (typeof collect === "string") return collect;
    if (typeof collect === "object") return collect._id || "-";
    return "-";
  };

  const renderSchoolId = (collect) => {
    if (typeof collect === "object") return collect.school_id || "-";
    return "-";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transactions by School</h1>

      {/* Input and button */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Enter School ID"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
        <button
          onClick={fetchBySchool}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Fetch
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      ) : (
        <table className="min-w-full rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="p-2 border dark:border-gray-600">Collect ID</th>
              <th className="p-2 border dark:border-gray-600">School ID</th>
              <th className="p-2 border dark:border-gray-600">Order Amount</th>
              <th className="p-2 border dark:border-gray-600">Status</th>
              <th className="p-2 border dark:border-gray-600">Custom Order ID</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {renderCollectId(tx.collect_id)}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {renderSchoolId(tx.collect_id)}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {tx.order_amount}
                  </td>
                  <td
                    className={`p-2 font-semibold ${
                      tx.status === "success"
                        ? "text-green-600 dark:text-green-400"
                        : tx.status === "pending"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {tx.status}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {tx.custom_order_id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-700 dark:text-gray-300"
                >
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
