import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import SchoolTransactions from "./Pages/SchoolTransactions";
import TransactionStatus from "./Pages/TransactionStatus";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4 flex space-x-4">
          <Link to="/">Dashboard</Link>
          <Link to="/school">By School</Link>
          <Link to="/status">Check Status</Link>
        </nav>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/school" element={<SchoolTransactions />} />
            <Route path="/status" element={<TransactionStatus />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
