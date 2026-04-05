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
    <div className="w-full shadow-md rounded-lg p-4  sm:p-6 mb-10 px-4 sm:px-8 md:px-16 md:w-[90%] lg:w-[80%] relative z-10 bg-white h-auto md:h-32">
      
      <p className="text-gray-600 mb-4 font-semibold text-sm sm:text-base">
        Find the best doctor for your needs
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">

        {/* Doctor Name */}
        <input
          type="text"
          name="name"
          placeholder="Doctor name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
        />

        {/* Specialization */}
        <select
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-[#5F6FFF] text-white rounded-lg px-6 py-2 text-sm sm:text-base hover:opacity-90 transition"
        >
          Search
        </button>

      </div>
    </div>
  );
}