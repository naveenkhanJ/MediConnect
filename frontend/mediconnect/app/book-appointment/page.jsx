"use client";

import { specialityData } from "@/assets/data";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookAppointmentPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = specialityData.filter((item) =>
    item.speciality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Book an Appointment
        </h1>
        <p className="text-gray-500 mt-3 text-sm">
          Select a specialty to find the right doctor for you
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#5F6FFF] text-white flex items-center justify-center font-semibold text-xs">1</span>
          <span className="text-[#5F6FFF] font-medium">Select Specialty</span>
        </div>
        <div className="w-10 h-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-xs">2</span>
          <span className="text-gray-400">Select Doctor</span>
        </div>
        <div className="w-10 h-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-xs">3</span>
          <span className="text-gray-400">Book Slot</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search specialty..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] focus:border-transparent bg-white shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Specialty Grid */}
      <div className="max-w-4xl mx-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No specialties match &quot;{search}&quot;</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filtered.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(`/book-appointment/${encodeURIComponent(item.speciality)}`)}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-[#5F6FFF] hover:shadow-md transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-[#EEF0FF] flex items-center justify-center group-hover:bg-[#5F6FFF] transition-colors">
                  <Image
                    src={item.image}
                    alt={item.speciality}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-gray-800 text-center group-hover:text-[#5F6FFF] transition-colors">
                  {item.speciality}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
