import { useState } from "react";
import api from "../Api";

export default function SchoolTransactions() {
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);

  const fetchBySchool = () => {
    api.get(`/payments/transactions/school/${schoolId}`).then((res) => {
      setTransactions(res.data);
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transactions by School</h1>
      <input
        type="text"
        placeholder="Enter School ID"
        value={schoolId}
        onChange={(e) => setSchoolId(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={fetchBySchool} className="bg-blue-600 text-white p-2">
        Fetch
      </button>

      <table className="table-auto w-full bg-white shadow-md rounded mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Collect ID</th>
            <th className="p-2">Order Amount</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-b hover:bg-gray-100">
              <td className="p-2">{tx._id}</td>
              <td className="p-2">{tx.order_amount}</td>
              <td className="p-2">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
