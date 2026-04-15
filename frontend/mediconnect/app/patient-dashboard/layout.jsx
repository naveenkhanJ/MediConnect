"use client";

import { useState } from "react";
import Sidebar from "@/components/AppointmentList";

export default function DashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState("Appointment List");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* Content */}
      <div className="flex-1 bg-gray-100">
        {children}
      </div>
    </div>
  );
}