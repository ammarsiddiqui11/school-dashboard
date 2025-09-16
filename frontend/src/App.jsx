import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Dashboard from "./Pages/Dashboard";
import SchoolTransactions from "./Pages/SchoolTransactions";
import TransactionStatus from "./Pages/TransactionStatus";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // In real app, decode JWT for user info
    }
  }, []);

  // ✅ Tailwind v4 dark mode toggle via `.dark` class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <nav className="bg-blue-600 dark:bg-gray-800 text-white p-4 flex justify-between items-center">
        {/* Left side links */}
        <div className="space-x-4">
          <Link to="/">Dashboard</Link>
          <Link to="/school">By School</Link>
          <Link to="/status">Check Status</Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
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
