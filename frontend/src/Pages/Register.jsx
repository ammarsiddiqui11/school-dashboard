import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.token) {
        alert("Registered successfully! Please login.");
        navigate("/login"); // ✅ redirect to login
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-4">
      <h2 className="text-xl font-bold mb-2">Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
}

export default Register;
