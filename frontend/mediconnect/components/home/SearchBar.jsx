"use client";

import { useState } from "react";
import Image from "next/image";

// 🔍 SEARCH COMPONENT
export function DoctorSearch() {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    console.log("Search Data:", form);
  };

  return (
    <div className="w-full  shadow-md rounded-lg p-6 mb-10  y-[-50] px-12 md:px-16  md:w-[80%] lg:w-[80%] mx-auto relative z-10 h-32 bg-white">
      <p className="text-gray-600 mb-4  font-semibold">
        Find the best doctor for your needs
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Doctor Name */}
        <input
          type="text"
          name="name"
          placeholder="Doctor name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
        />

        {/* Specialization */}
        <select
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
        >
          <option value="">Specialization</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Pediatrician">Pediatrician</option>
        </select>

        {/* Date */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-[#5F6FFF] text-white rounded-lg px-6 py-2 hover:opacity-90 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}




