"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = "http://localhost:4000";

export default function DoctorCard() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/doctors`)
      .then((r) => r.json())
      .then((data) => { setDoctors(Array.isArray(data) ? data.slice(0, 10) : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full px-6 md:px-18 py-20 sm:px-8 bg-[#F9FAFB]">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-12">
          Top Doctors to Book
        </h2>
        <p className="text-gray-500 mt-3">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading doctors...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="bg-[#EEF0FF] flex justify-center p-6">
                <img
                  src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=5F6FFF&color=fff&size=180&rounded=true`}
                  alt={doc.fullName}
                  width={180}
                  height={160}
                  className="object-cover rounded-xl w-28 h-28"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <p className="text-green-500 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Available
                </p>
                <h3 className="font-semibold text-lg text-gray-900">{doc.fullName}</h3>
                <p className="text-gray-500 text-sm mb-4">{doc.speciality}</p>
                <button
                  onClick={() => router.push(`/appointments/${doc.id}`)}
                  className="py-1.5 border flex px-16 border-[#5F6FFF] text-[#5F6FFF] rounded-full hover:opacity-90 transition items-center cursor-pointer hover:bg-[#5F6FFF] hover:text-white"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* See More Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => router.push("/book-appointment")}
          className="px-12 py-3 bg-[#5F6FFF] text-white rounded-full hover:opacity-90 transition"
        >
          See more
        </button>
      </div>
    </section>
  );
}
