"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MyAppointmentsPage from "@/app/my-appointments/page";
import PatientProfile from "@/components/patient_profile";
import Dashboard from "@/components/Patient_dashbord";


export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("Appointment List");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="flex-1 bg-gray-100">
        {activeTab === "Dashboard" && <Dashboard />}

        {activeTab === "Appointment List" && <MyAppointmentsPage />}

        {activeTab === "Messages" && (
          <div className="p-6">Messages Page</div>
        )}

        {activeTab === "patient setting" && <PatientProfile />}
      </div>
    </div>
  );
}