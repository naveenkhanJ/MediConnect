"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "@/lib/api";

import AvailabilityCalendar from "../availability/AvailabilityCalendar";
import DoctorProfile from "../doctorProfile/DoctorProfile";
import PendingAppointments from "../pendingAppointments/PendingAppointments";

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [summary, setSummary] = useState(null);

  const doctorId = "doc124"; // fakeAuth

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await axios.get(apiUrl("/api/dashboard/summary"), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setSummary(res.data);
  };

  const menu = [
    { key: "dashboard", label: "Dashboard" },
    { key: "availability", label: "Availability" },
    { key: "profile", label: "Doctor Profile" },
    { key: "appointments", label: "Pending Appointments" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 pt-20">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-xl font-bold mb-6">Doctor Panel</h2>

        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full text-left p-2 rounded mb-2 ${
              activeTab === item.key ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-auto">
        {/* TOP DASHBOARD SUMMARY */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500">Patients Today</h3>
              <p className="text-2xl font-bold">
                {summary?.patientsToday || 0}
              </p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500">Appointments Today</h3>
              <p className="text-2xl font-bold">
                {summary?.appointmentsToday || 0}
              </p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500">Pending</h3>
              <p className="text-2xl font-bold">
                {summary?.pendingAppointments || 0}
              </p>
            </div>
          </div>
        )}

        {/* DEFAULT = CALENDAR */}
        {activeTab === "dashboard" && <AvailabilityCalendar />}

        {activeTab === "availability" && <AvailabilityCalendar />}
        {activeTab === "profile" && <DoctorProfile />}
        {activeTab === "appointments" && <PendingAppointments />}
      </div>
    </div>
  );
}