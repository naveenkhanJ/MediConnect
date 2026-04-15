"use client";

import { useState } from "react";

export default function ProfileSettings() {
  const [form, setForm] = useState({
    title: "",
    firstName: "",
    lastName: "",
    displayName: "",
    mobile: "",
    gender: "",
    age: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved Data:", form);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-3 text-sm font-medium text-gray-600">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
            Profile
          </button>
          <button>Change Password</button>
          <button>Email Notification</button>
          <button>Delete Account</button>
        </div>

        {/* Title */}
        <div className="mt-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Profile Settings
          </h1>
          <p className="text-sm text-gray-500">Information</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}
          <div>
            <label className="text-sm text-gray-600">Title</label>
            <select
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="">Select</option>
              <option>Mr</option>
              <option>Mrs</option>
              <option>Miss</option>
            </select>
          </div>

          {/* First Name */}
          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm text-gray-600">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Last Name"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="text-sm text-gray-600">Display Name</label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Display Name"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm text-gray-600">Mobile Number</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="+94 XX XXX XXXX"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="text-sm text-gray-600">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Age"
            />
          </div>

          {/* Button */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}