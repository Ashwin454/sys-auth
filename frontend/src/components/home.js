import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome 👋</h1>
        <p className="text-gray-600 mb-6">
          This is a sample home page. You can now navigate to the login or signup page.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            Go to Login
          </Link>
          <Link
            to="/signup"
            className="border border-orange-500 text-orange-500 py-2 rounded hover:bg-orange-100 transition"
          >
            Go to Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
