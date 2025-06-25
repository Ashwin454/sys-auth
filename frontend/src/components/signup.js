import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const steps = ["Username", "College", "Email", "Date of Birth", "Password", "Finish"];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    college: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await fetch("http://universities.hipolabs.com/search?country=India");
        const data = await res.json();
        setColleges(data.map((c) => c.name).slice(0, 50));
      } catch (e) {
        toast.error("Could not load college list");
      }
    }
    fetchColleges();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const next = () => step < steps.length - 1 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://sys-auth.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account created! You can now log in.");
        navigate("/login");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleLinkedInLogin = () => {
    const clientId = "77wwpkm9bcdsbe";
    const redirectUri = "https://sys-auth.onrender.com/auth/linkedin/callback";
    const scope = "openid profile email";
    const state = Math.random().toString(36).substring(2);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.location.href = authUrl;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <InputStep
            icon={<FaUser />}
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        );
      case 1:
        return (
          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">Select your college</label>
            <select
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 bg-white"
            >
              <option value="">-- Choose college --</option>
              {colleges.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        );
      case 2:
        return (
          <InputStep
            icon={<FaEnvelope />}
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <InputStep
            icon="🎂"
            name="dob"
            type="date"
            placeholder="Select your date of birth"
            value={formData.dob}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <>
            <InputStep
              icon={<FaLock />}
              name="password"
              type="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputStep
              icon={<FaLock />}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </>
        );
      case 5:
        return (
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded flex justify-center items-center mb-4"
          >
            <span className="mr-2">🔐</span> Sign up
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md transition-all"
      >
        <h2 className="text-xl font-bold mb-2 text-center flex items-center justify-center gap-2">
          <span>👤</span> Sign up Now
        </h2>
        <p className="text-center text-sm mb-4">
          Be part of something <strong>great!</strong> Start <strong>learning</strong> and{" "}
          <strong>contributing</strong> with us!
        </p>

        <motion.div
          key={step}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}

          <button
            type="button"
            onClick={handleLinkedInLogin}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
          >
            <span className="mr-2">🔗</span> Sign up with LinkedIn
          </button>
        </motion.div>

        <div className="flex justify-between mt-4">
          {step > 0 && (
            <button type="button" onClick={prev} className="text-sm text-gray-500 underline">
              Back
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              onClick={next}
              className="ml-auto text-sm text-orange-600 underline"
            >
              Next →
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-sm">
          Already a member?{" "}
          <a href="/login" className="text-orange-500 font-semibold">
            Login Now →
          </a>
        </p>
      </form>
    </div>
  );
}

const InputStep = ({ icon, name, value, onChange, placeholder, type = "text" }) => (
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
