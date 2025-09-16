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
      <input
        type="text"
        placeholder="Enter Custom Order ID"
        value={customId}
        onChange={(e) => setCustomId(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={checkStatus} className="bg-green-600 text-white p-2">
        Check
      </button>

      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}

      {status && (
        <div className="mt-4 bg-white p-4 shadow rounded">
          <h2 className="text-lg font-bold mb-2">Transaction Details</h2>
          <p><b>Status:</b> {status.status || "N/A"}</p>
          <p><b>Amount:</b> {status.order_amount || "N/A"}</p>
          <p><b>Transaction Amount:</b> {status.transaction_amount || "N/A"}</p>
          <p><b>Custom Order ID:</b> {status.custom_order_id || "N/A"}</p>
          <p><b>Payment Mode:</b> {status.payment_mode || "N/A"}</p>
          <p><b>Message:</b> {status.payment_message || "N/A"}</p>
          <p><b>Time:</b> {status.payment_time ? new Date(status.payment_time).toLocaleString() : "N/A"}</p>
        </div>
      )}
    </div>
  );
}
