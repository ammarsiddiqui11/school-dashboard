import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Dashboard from "./Pages/Dashboard";
import SchoolTransactions from "./Pages/SchoolTransactions";
import TransactionStatus from "./Pages/TransactionStatus";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // In real app, decode JWT for user info
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        {/* Left side links */}
        <div className="space-x-4">
          <Link to="/">Dashboard</Link>
          <Link to="/school">By School</Link>
          <Link to="/status">Check Status</Link>
        </div>

        {/* Right side auth buttons */}
        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/school" element={<SchoolTransactions />} />
          <Route path="/status" element={<TransactionStatus />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

// ✅ Wrap App in Router in main.jsx
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
