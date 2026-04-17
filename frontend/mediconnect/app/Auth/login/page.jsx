"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      // Save token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Role-based redirect
      const role = data.user.role;

      if (role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (role === 'doctor') {
        window.location.href = '/doctor/dashboard';
      } else if (role === 'patient') {
        window.location.href = '/';
      } else {
        window.location.href = '/';
      }

    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#EEF0FF] to-white px-4">
      
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-[#5F6FFF] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-[#5F6FFF] text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/Auth/register" className="text-[#5F6FFF] font-medium hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}