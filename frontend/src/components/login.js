import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Ensure the API endpoint is correct: https://sys-auth.onrender.com/api/login
      const res = await fetch("https://sys-auth.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        toast.error(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      toast.error("Something went wrong! Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkedInLogin = () => {
    // Verify clientId and redirectUri are correctly configured for your LinkedIn OAuth application
    const clientId = "77wwpkm9bcdsbe";
    const redirectUri = "https://sys-auth.onrender.com/auth/linkedin/callback";
    const scope = "openid profile email";
    const state = Math.random().toString(36).substring(2);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.location.href = authUrl;
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
          id="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
        <InputField
          icon={<FaLock />}
          name="password"
          id="password"
          placeholder="Enter your Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={handleLinkedInLogin}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
        >
          <span className="mr-2">🔗</span> Login with LinkedIn
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

const InputField = ({ icon, name, id, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4 flex items-center border rounded-md px-3 py-2 bg-gray-100">
    <label htmlFor={id} className="text-gray-500 mr-2">
      {icon}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full bg-transparent outline-none"
      aria-label={placeholder}
    />
  </div>
);