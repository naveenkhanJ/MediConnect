"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    gender: "",
    birthday: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // TODO: connect backend API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#EEF0FF] to-white px-4 py-10">
      
      <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl p-8">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg  focus:ring-[#5F6FFF]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-[#5F6FFF]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg  focus:ring-[#5F6FFF]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg  focus:ring-[#5F6FFF]"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg  focus:ring-[#5F6FFF]"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg  focus:ring-[#5F6FFF]"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Birthday */}
          <div>
            <label className="text-sm text-gray-600">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg  focus:ring-[#5F6FFF]"
            />
          </div>

          {/* Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#5F6FFF] text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              Register
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/Auth/login" className="text-[#5F6FFF] font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}