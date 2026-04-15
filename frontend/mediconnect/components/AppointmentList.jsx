"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Clock,
  Mail,
  Phone,
  Eye,
  CalendarDays,
  MoreVertical,
} from "lucide-react";

export default function AppointmentList() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    { name: "All", count: 229 },
    { name: "Confirmed", count: 179 },
    { name: "Pending", count: 47 },
    { name: "Cancelled", count: 3 },
    { name: "Upcoming", count: 0 },
  ];

  const appointments = [
    {
      id: "#6313",
      name: "Dr Darren Elder",
      department: "Cardiologist",
      date: "31 Mar 2026 8:00 pm",
      email: "patient@example.com",
      phone: "+94 77 123 4567",
      img: "/doc1.jpg",
    },
    {
      id: "#6314",
      name: "Dr Darren Elder",
      department: "Cardiologist",
      date: "31 Mar 2026 11:20 am",
      email: "patient@example.com",
      phone: "+94 77 123 4567",
      img: "/doc1.jpg",
    },
    {
      id: "#6315",
      name: "Dr Anya Sharma",
      department: "Dentist",
      date: "01 Apr 2026 9:00 am",
      email: "patient@example.com",
      phone: "+94 77 123 4567",
      img: "/doc2.jpg",
    },
  ];

  return (
    <div className="p-6 bg-white mt-20">

      {/* 🔵 Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-3 h-3 bg-[#5F6FFF] rounded-full"></span>
        <h1 className="text-2xl font-bold text-gray-800">
          All Appointments
        </h1>
      </div>

      {/* 🔍 Search + Clear */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center bg-white border rounded-full px-4 py-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Type to search doctor..."
            className="flex-1 outline-none text-sm"
          />
          <Search size={18} className="text-gray-400" />
        </div>

        <button className="bg-[#5F6FFF] text-white px-5 py-2 rounded-full text-sm">
          Clear
        </button>
      </div>

      {/* 🧭 Filters + Date */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveFilter(item.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm
                ${
                  activeFilter === item.name
                    ? "bg-[#5F6FFF] text-white border-[#5F6FFF]"
                    : "bg-white text-gray-700"
                }`}
            >
              {item.name}
              <span
                className={`px-2 py-0.5 rounded-full text-xs
                  ${
                    activeFilter === item.name
                      ? "bg-white text-[#5F6FFF]"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Date selector */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border bg-white px-4 py-2 rounded-full text-sm">
            <Calendar size={16} />
            Select Date
            <ChevronDown size={16} />
          </button>

          <button className="w-10 h-10 flex items-center justify-center border rounded-full bg-white">
            <CalendarDays size={18} />
          </button>
        </div>
      </div>

      {/* 📋 Appointment Cards */}
      <div className="space-y-4">
        {appointments.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center flex-wrap gap-4"
          >
            {/* Col 1 */}
            <div className="flex items-center gap-3 min-w-[200px]">
              <img
                src={item.img}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-[#5F6FFF] text-sm font-semibold">
                  {item.id}
                </p>
                <h2 className="font-semibold text-gray-800">
                  {item.name}
                </h2>
              </div>
            </div>

            {/* Col 2 */}
            <div className="min-w-[220px]">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Clock size={14} />
                {item.date}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {item.department}
              </p>
            </div>

            {/* Col 3 */}
            <div className="min-w-[220px] text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                {item.email}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Phone size={14} />
                {item.phone}
              </div>
            </div>

            {/* Col 4 */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Eye size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <CalendarDays size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}