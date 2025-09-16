import { useEffect, useState } from "react";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/payments/transactions?page=${page}&limit=${limit}&sort=${sort}&order=${order}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      console.log("API response:", data);

      if (Array.isArray(data)) {
        setTransactions(data);
        setTotalPages(1);
      } else if (data.data && Array.isArray(data.data)) {
        setTransactions(data.data);
        setTotalPages(data.totalPages || 1);
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

  useEffect(() => {
    fetchTransactions();
  }, [page, sort, order]);

  if (loading) return <p className="p-4">Loading...</p>;

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
      <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>

      {/* Sorting Controls */}
      <div className="flex space-x-2 mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        >
          <option value="createdAt">Created At</option>
          <option value="status">Status</option>
          <option value="order_amount">Order Amount</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Transactions Table */}
      <table className="min-w-full rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <tr>
            <th className="py-2 px-4 border dark:border-gray-600">Collect ID</th>
            <th className="py-2 px-4 border dark:border-gray-600">School ID</th>
            <th className="py-2 px-4 border dark:border-gray-600">Order Amount</th>
            <th className="py-2 px-4 border dark:border-gray-600">Status</th>
            <th className="py-2 px-4 border dark:border-gray-600">Custom Order ID</th>
            <th className="py-2 px-4 border dark:border-gray-600">Created At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr
                key={txn._id}
                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                  {renderCollectId(txn.collect_id)}
                </td>
                <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                  {renderSchoolId(txn.collect_id)}
                </td>
                <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                  {txn.order_amount}
                </td>
                <td
                  className={`py-2 px-4 font-semibold ${
                    txn.status === "success"
                      ? "text-green-600 dark:text-green-400"
                      : txn.status === "pending"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {txn.status}
                </td>
                <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                  {txn.custom_order_id}
                </td>
                <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                  {txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center py-4 text-gray-700 dark:text-gray-300"
              >
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex space-x-2 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 dark:bg-gray-700 dark:text-gray-100 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-800 dark:text-gray-200">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 dark:bg-gray-700 dark:text-gray-100 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
