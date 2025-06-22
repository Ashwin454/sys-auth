import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-2 text-center flex items-center justify-center gap-2">
          <span>🔐</span> Login to your account
        </h2>
        <p className="text-center text-sm mb-4 text-gray-600">
          Welcome back! Login to continue.
        </p>

        <InputField
          icon={<FaEnvelope />}
          name="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          icon={<FaLock />}
          name="password"
          placeholder="Enter your Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          New user?{" "}
          <a href="/signup" className="text-orange-500 font-semibold">
            Sign up here →
          </a>
        </p>
      </form>
    </div>
  );
}

const InputField = ({ icon, name, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4 flex items-center border rounded-md px-3 py-2 bg-gray-100">
    <span className="text-gray-500 mr-2">{icon}</span>
    <input
      className="w-full bg-transparent outline-none"
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
  </div>
);
