import { useState } from "react";
import api from "../Api";

export default function TransactionStatus() {
  const [customId, setCustomId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const checkStatus = async () => {
    try {
      setError("");
      setStatus(null);
      const res = await api.get(`/payments/status/${customId}`);
      setStatus(res.data);
    } catch (err) {
      console.error("Error fetching status:", err);
      setError("Failed to fetch status. Please check the ID or try again.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Check Transaction Status</h1>

      {/* Input and button */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Enter Custom Order ID"
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
        <button
          onClick={checkStatus}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Check
        </button>
      </div>

      {error && (
        <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>
      )}

      {status && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Transaction Details</h2>

          <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Order Amount</th>
                <th className="p-2 text-center">Transaction Amount</th>
                <th className="p-2 text-center">Custom Order ID</th>
                <th className="p-2 text-center">Payment Mode</th>
                <th className="p-2 text-center">Message</th>
                <th className="p-2 text-center">Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                <td
                  className={`p-2 text-center font-semibold ${
                    status.status === "success"
                      ? "text-green-600 dark:text-green-400"
                      : status.status === "pending"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {status.status || "N/A"}
                </td>
                <td className="p-2 text-center">{status.order_amount || "N/A"}</td>
                <td className="p-2 text-center">
                  {status.transaction_amount || "N/A"}
                </td>
                <td className="p-2 text-center">
                  {status.custom_order_id || "N/A"}
                </td>
                <td className="p-2 text-center">{status.payment_mode || "N/A"}</td>
                <td className="p-2 text-center">{status.payment_message || "N/A"}</td>
                <td className="p-2 text-center">
                  {status.payment_time
                    ? new Date(status.payment_time).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
