import { useEffect, useState } from "react";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
    try {
        const res = await fetch(
        "http://localhost:5000/api/payments/transactions",
      {
        headers: {
          Authorization: `Bearer ${token}` // replace with your login token
        }
      }
    );
    const data = await res.json();
    console.log("API response:", data);

    // Handle both array or { data: [] } cases
    if (Array.isArray(data)) {
      setTransactions(data);
    } else if (data.data && Array.isArray(data.data)) {
      setTransactions(data.data);
    } else {
      setTransactions([]);
    }
  } catch (err) {
    console.error("Error fetching transactions:", err);
    setTransactions([]);
  } finally {
    setLoading(false);
  }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Collect ID</th>
            <th className="py-2 px-4 border">School ID</th>
            <th className="py-2 px-4 border">Order Amount</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Custom Order ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr key={txn._id}>
                <td className="py-2 px-4 border">{txn.collect_id?._id}</td>
                <td className="py-2 px-4 border">{txn.collect_id?.school_id}</td>
                <td className="py-2 px-4 border">{txn.order_amount}</td>
                <td className="py-2 px-4 border">{txn.status}</td>
                <td className="py-2 px-4 border">{txn.custom_order_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

{/* <tbody>
            {transactions.length > 0 ? (
                transactions.map((txn) => (
                <tr key={txn._id}>
                    <td className="py-2 px-4 border">
                    {typeof txn.collect_id === "object" ? txn.collect_id?._id : txn.collect_id}
                    </td>
                    <td className="py-2 px-4 border">
                    {typeof txn.collect_id === "object" ? txn.collect_id?.school_id : txn.school_id}
                    </td>
                    <td className="py-2 px-4 border">{txn.order_amount}</td>
                    <td className="py-2 px-4 border">{txn.status}</td>
                    <td className="py-2 px-4 border">{txn.custom_order_id}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="5" className="text-center py-4">
                    No transactions found
                </td>
                </tr>
            )}
            </tbody> */}