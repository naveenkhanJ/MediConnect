"use client";

import { useState } from "react";
import {
 
  Clock,
  Mail,
  Phone,
  CalendarDays,
  MoreVertical,
} from "lucide-react";
import { filterAppointments } from "@/lib/appointmentListFilters";

export default function AppointmentList() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const filters = [
    { name: "All", count: 2 },
    { name: "Confirmed", count: 1 },
    { name: "Pending", count: 4 },
    { name: "Cancelled", count: 1},
    { name: "Upcoming", count: 0 },
  ];

  const [appointments, setAppointments] = useState([
    {
      id: "1",
      name: "Dr Darren Elder",
      department: "Cardiologist",
      date: "31 Mar 2026 8:00 pm",
      email: "patient@example.com",
      phone: "+94 77 123 4567",
      img: "/doc1.jpg",
      status: "Confirmed",
    },
    {
      id: "2",
      name: "Dr Darren Elder",
      department: "Cardiologist",
      date: "31 Mar 2026 11:20 am",
      email: "patient@example.com",
      phone: "+94 77 123 4567",
      img: "/doc1.jpg",
      status: "Pending",
    },
    {
      id: "3",
      name: "Dr Anya Sharma",
      department: "Dentist",
      date: "01 Apr 2026 9:00 am",
      email: "patient@example.com",
      phone: "+94 77 123 4567",
      img: "/doc2.jpg",
      status: "Cancelled",
    },
  ]);

  const filteredAppointments = filterAppointments(appointments, {
    searchQuery,
    activeFilter,
    selectedDate,
  });

  return (
    <div className="p-6 bg-white mt-20">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-sm text-gray-600 underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-3 h-3 bg-[#5F6FFF] rounded-full"></span>
        <h1 className="text-2xl font-bold text-gray-800">
          All Appointments
        </h1>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {filters.map((item) => (
            <button
              key={item.name}
              type="button"
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

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          {selectedDate ? (
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className="text-sm text-gray-600 underline"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {filteredAppointments.map((item) => (
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
                  #{item.id}
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

              {/* Status */}
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium
                  ${
                    item.status === "Confirmed"
                      ? "bg-green-100 text-green-600"
                      : item.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
              >
                {item.status}
              </span>

              <button className="p-2 rounded-full hover:bg-gray-100">
                <CalendarDays size={18} />
              </button>

              <button
                onClick={() => {
                  setSelectedAppointment(item);
                  setShowCancelPopup(true);
                }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">
              Cancel Appointment
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel #{selectedAppointment?.id}?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelPopup(false)}
                className="px-4 py-2 border rounded-md"
              >
                No
              </button>

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");

                    const res = await fetch(
                      `http://localhost:4000/appointments/${selectedAppointment.id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          status: "CANCELLED",
                        }),
                      }
                    );

                    const data = await res.json();

                    if (!res.ok) {
                      alert(data.message || "Cancel failed");
                      return;
                    }

                    // Update UI
                    setAppointments((prev) =>
                      prev.map((appt) =>
                        appt.id === selectedAppointment.id
                          ? { ...appt, status: "Cancelled" }
                          : appt
                      )
                    );

                    setShowCancelPopup(false);

                  } catch (err) {
                    alert("Something went wrong");
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}