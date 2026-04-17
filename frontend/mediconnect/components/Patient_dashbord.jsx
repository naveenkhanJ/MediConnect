"use client";

import { Calendar, CloudUpload, Folder } from "lucide-react";

export default function PatientDashboard() {
  const doctors = [
    {
      name: "Dr Darren Elder",
      specialization: "Cardiologist",
      img: "/doc1.jpg",
    },
    {
      name: "Dr John Smith",
      specialization: "General Doctor",
      img: "/doc2.jpg",
    },
    {
      name: "Dr Anya Sharma",
      specialization: "Dentist",
      img: "/doc3.jpg",
    },
    {
      name: "Dr Michael Lee",
      specialization: "Urologist",
      img: "/doc4.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT - ACTIONS */}
        <div className="space-y-4">

          {/* Book Appointment */}
          <button className="w-full bg-[#5F6FFF] text-white p-5 rounded-2xl shadow-md text-left hover:opacity-90 transition">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                Book an Appointment
              </span>
              <span className="text-2xl">+</span>
            </div>
          </button>

          {/* Upload Report */}
          <button className="w-full bg-white border p-4 rounded-2xl flex items-center gap-3 hover:bg-gray-50 transition">
            <CloudUpload className="text-gray-500" size={20} />
            <span className="text-gray-700 font-medium">
              Upload Medical Report
            </span>
          </button>

          {/* Medical History */}
          <button className="w-full bg-white border p-4 rounded-2xl flex items-center gap-3 hover:bg-gray-50 transition">
            <Folder className="text-gray-500" size={20} />
            <span className="text-gray-700 font-medium">
              View Full Medical History
            </span>
          </button>
        </div>

        {/* RIGHT - FAVOURITES */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Favourites
            </h2>
            <button className="text-[#5F6FFF] text-sm font-medium">
              View All
            </button>
          </div>

          {/* Doctor List */}
          <div className="space-y-4">
            {doctors.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-xl p-3 hover:bg-gray-50 transition"
              >
                {/* Left Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={doc.img}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {doc.specialization}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
                  <Calendar size={18} className="text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}