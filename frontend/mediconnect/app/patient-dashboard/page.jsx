"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AppointmentList from "@/components/AppointmentList";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("Appointment List");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="flex-1 bg-gray-100">
        {activeTab === "Dashboard" && (
          <div className="p-6">Dashboard Content</div>
        )}

        {activeTab === "Appointment List" && <AppointmentList />}

        {activeTab === "Messages" && (
          <div className="p-6">Messages Page</div>
        )}

        {activeTab === "Profile Settings" && (
          <div className="p-6">Profile Settings Page</div>
        )}
      </div>
    </div>
  );
}