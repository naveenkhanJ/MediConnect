"use client";

import { specialityData } from "@/assets/data";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

const API = "http://localhost:4000";

function ConsultationBadge({ type }) {
  if (type === "BOTH") {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
        Online & In-Person
      </span>
    );
  }
  if (type === "ONLINE") {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
        Online Only
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
      In-Person Only
    </span>
  );
}

const ALL_SPECIALTIES = [...new Set(specialityData.map((s) => s.speciality))];

export default function DoctorsBySpecialtyPage() {
  const { specialty } = useParams();
  const router = useRouter();

  const decodedSpecialty = decodeURIComponent(specialty);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/doctors?speciality=${encodeURIComponent(decodedSpecialty)}`)
      .then((r) => r.json())
      .then((data) => { setDoctors(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [decodedSpecialty]);

  const visibleDoctors = useMemo(
    () => doctors.filter((d) => d.fullName.toLowerCase().includes(search.toLowerCase())),
    [doctors, search]
  );

  const switchSpecialty = (s) => {
    setDropdownOpen(false);
    setSearch("");
    router.push(`/book-appointment/${encodeURIComponent(s)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => router.push("/book-appointment")}
          className="text-sm text-[#5F6FFF] hover:underline flex items-center gap-1 mb-4"
        >
          ← Back to Specialties
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{decodedSpecialty}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{visibleDoctors.length} doctor(s) found</p>
          </div>

          {/* Specialty Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#5F6FFF] bg-white shadow-sm"
            >
              <svg className="w-4 h-4 text-[#5F6FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Change Specialty
              <svg className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 max-h-60 overflow-y-auto">
                {ALL_SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => switchSpecialty(s)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f0f1ff] hover:text-[#5F6FFF] transition-colors ${
                      s.toLowerCase() === decodedSpecialty.toLowerCase()
                        ? "text-[#5F6FFF] font-semibold bg-[#f0f1ff]"
                        : "text-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-xs">✓</span>
          <span className="text-green-500 font-medium">Specialty</span>
        </div>
        <div className="w-10 h-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#5F6FFF] text-white flex items-center justify-center font-semibold text-xs">2</span>
          <span className="text-[#5F6FFF] font-medium">Select Doctor</span>
        </div>
        <div className="w-10 h-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-xs">3</span>
          <span className="text-gray-400">Book Slot</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="relative max-w-sm">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctor by name..."
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] focus:border-transparent bg-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>
      </div>

      {/* Doctor List */}
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {loading ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400">Loading doctors...</div>
        ) : visibleDoctors.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400">
            {search ? `No doctors named "${search}" in ${decodedSpecialty}.` : "No doctors found for this specialty."}
          </div>
        ) : (
          visibleDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-5 hover:shadow-md hover:border-[#5F6FFF] transition-all"
            >
              {/* Avatar */}
              <div className="bg-[#EEF0FF] rounded-xl p-3 flex-shrink-0">
                <img
                  src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=5F6FFF&color=fff&size=80&rounded=true`}
                  alt={doc.fullName}
                  width={80}
                  height={80}
                  className="object-cover rounded-lg w-20 h-20"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{doc.fullName}</h3>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-green-500 text-xs">Available</span>
                </div>
                <p className="text-gray-500 text-sm">
                  {doc.category} · {doc.speciality} · {doc.experience}
                </p>
                <div className="mt-2">
                  <ConsultationBadge type={doc.consultationType} />
                </div>
              </div>

              {/* Fee + Button */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <p className="text-gray-800 font-semibold">
                  Rs. {doc.fees} <span className="text-gray-400 text-xs font-normal">/ visit</span>
                </p>
                <button
                  onClick={() => router.push(`/appointments/${doc.id}`)}
                  className="px-6 py-2 bg-[#5F6FFF] text-white rounded-full text-sm font-medium hover:bg-[#4a5ce6] transition"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
