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
    <div className="w-full  shadow-md rounded-2xl p-6 mb-10  y-[-50] px-12 md:px-16  md:w-[80%] lg:w-[80%] mx-auto relative z-10  bg-white">
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



export default function DoctorsSection() {
  return (
    <section className="w-full px-6 md:px-16 py-16 bg-[#F9FAFB]">

      {/* Search Box */}
      <DoctorSearch />

      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Top Doctors to Book
        </h2>
        <p className="text-gray-500 mt-3">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {doctors.slice(0, 10).map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
          >
            <div className="bg-[#EEF0FF] flex justify-center p-6">
              <Image
                src={doc.image}
                alt={doc.name}
                width={200}
                height={200}
                className="object-cover rounded-xl"
              />
            </div>

            <div className="p-5 space-y-2 text-center">
              <p className="text-green-500 text-sm flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Available
              </p>

              <h3 className="font-semibold text-lg text-gray-900">
                {doc.name}
              </h3>

              <p className="text-gray-500 text-sm">{doc.role}</p>

              <button className="mt-4 bg-[#5F6FFF] text-white px-4 py-2 rounded-full">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* See More */}
      <div className="flex justify-center mt-12">
        <button className="px-8 py-3 bg-[#5F6FFF] text-white rounded-full">
          See more
        </button>
      </div>
    </section>
  );
}
