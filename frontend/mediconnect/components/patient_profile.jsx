"use client";
import React, { useState } from 'react';

export default function ProfileUpdatePage() {
  // Initialize state with existing user data
  const [userData, setUserData] = useState({
    title: "Mr.",
    firstName: "John",
    lastName: "Doe",
    mobile: "+1 234 567 8900",
    displayName: "John Doe",
    gender: "Male",
    age: "35"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating Database with:", userData);
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="min-h-screen  p-4  font-sans text-slate-700 mt-16 border border-gray-200">
      <div className="max-w-4xl bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100/50 p-2 border-b border-gray-200 p ">
          <button className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-t-lg font-medium text-sm">Profile</button>
          <button className="flex-1 py-3 px-4 text-gray-500 hover:bg-gray-200 transition text-sm">Change Password</button>
          <button className="flex-1 py-3 px-4 text-gray-500 hover:bg-gray-200 transition text-sm">Email Notification</button>
          <button className="flex-1 py-3 px-4 text-gray-500 hover:bg-gray-200 transition text-sm">Delete Account</button>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Profile Settings</h1>
          <div className="border-b border-gray-100 mb-8"></div>
          
          <form onSubmit={handleSubmit}>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6">Information</h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Title Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">Title</label>
                <select 
                  name="title"
                  value={userData.title}
                  onChange={handleChange}
                  className="p-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                >
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Dr.</option>
                </select>
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">Last Name</label>
                <input 
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">First Name</label>
                <input 
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">Mobile Number</label>
                <input 
                  type="text"
                  name="mobile"
                  value={userData.mobile}
                  onChange={handleChange}
                  className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Display Name (Full Width logic inside grid) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">Display Name</label>
                <input 
                  type="text"
                  name="displayName"
                  value={userData.displayName}
                  onChange={handleChange}
                  className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Gender & Age Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Gender</label>
                  <select 
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                    className="p-3 bg-white border border-gray-200 rounded-lg outline-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Age</label>
                  <input 
                    type="number"
                    name="age"
                    value={userData.age}
                    onChange={handleChange}
                    className="p-3 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="mt-12 flex justify-end">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg font-semibold shadow-md shadow-blue-200 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}