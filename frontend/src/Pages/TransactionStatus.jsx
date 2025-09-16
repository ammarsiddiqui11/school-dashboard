import { useState } from "react";
import api from "../Api";

export default function TransactionStatus() {
  const [customId, setCustomId] = useState("");
  const [status, setStatus] = useState(null);

  const checkStatus = () => {
    api.get(`/payments/transaction-status/${customId}`).then((res) => {
      setStatus(res.data);
    });
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

      {status && (
        <div className="mt-4 bg-white p-4 shadow rounded">
          <p><b>Status:</b> {status.status}</p>
          <p><b>Amount:</b> {status.order_amount}</p>
          <p><b>Transaction Amount:</b> {status.transaction_amount}</p>
        </div>
      )}
    </div>
  );
}
