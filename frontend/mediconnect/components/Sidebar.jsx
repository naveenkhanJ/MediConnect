"use client";

import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  User,
  Settings,
  Heart,
  KeyRound,
  LogOut,
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Appointment List", icon: CalendarDays },
    { name: "patient setting", icon: Settings },
    { name: "Favourites", icon: Heart },
    { name: "Change Password", icon: KeyRound },
    { name: "Logout", icon: LogOut },
  ];

  return (
    <div className="w-72 bg-white min-h-screen rounded-lg shadow-sm p-4 ml-30 mr-10 mt-20">
      
      {/* 🔵 Top Banner */}
      <div className="relative rounded-xl overflow-hidden mb-14">
        <div className="h-28 bg-[#5F6FFF] flex items-center justify-center">
          {/* Optional pattern overlay */}
          <div className="absolute inset-0 opacity-10  bg-repeat"></div>
        </div>

        {/* 👤 Profile Image */}
        <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2">
          <img
            src="/profile.jpg" 
            alt="profile"
            className="w-20 h-20 rounded-full border-4 border-white object-cover shadow"
          />
        </div>
      </div>

      {/* 👤 Name + Status */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <h2 className="font-semibold text-gray-800">
            Emily Rival
          </h2>

          {/* status badge */}
          <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-[#5F6FFF] rounded-full"></span>
          </span>
        </div>

        {/* role badge */}
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm text-gray-600 shadow-sm">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Patient
        </div>
      </div>

      {/* 📌 Navigation */}
      <div className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <div
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  isActive
                    ? "bg-[#5F6FFF] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}