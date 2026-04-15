"use client";

import { doctors } from "@/assets/data";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

// Badge shows what type of consultation is available
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

export default function DoctorsBySpecialtyPage() {
  const { specialty } = useParams();
  const router = useRouter();

  const decodedSpecialty = decodeURIComponent(specialty);

  // Filter doctors by specialty from static data
  const filteredDoctors = doctors.filter(
    (doc) => doc.speciality.toLowerCase() === decodedSpecialty.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => router.push("/book-appointment")}
          className="text-sm text-[#5F6FFF] hover:underline flex items-center gap-1 mb-4"
        >
          ← Back to Specialties
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{decodedSpecialty}</h1>
        <p className="text-gray-500 text-sm mt-1">{filteredDoctors.length} doctor(s) available</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-10 text-sm">
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

      {/* Doctor List */}
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400">
            No doctors found for this specialty.
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-5 hover:shadow-md hover:border-[#5F6FFF] transition-all"
            >
              {/* Doctor Image */}
              <div className="bg-[#EEF0FF] rounded-xl p-3 flex-shrink-0">
                <Image
                  src={doc.image}
                  alt={doc.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{doc.name}</h3>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-green-500 text-xs">Available</span>
                </div>
                <p className="text-gray-500 text-sm">{doc.degree} · {doc.speciality} · {doc.experience}</p>
                <div className="mt-2">
                  <ConsultationBadge type={doc.consultationType} />
                </div>
              </div>

              {/* Fee + Button */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <p className="text-gray-800 font-semibold">${doc.fees} <span className="text-gray-400 text-xs font-normal">/ visit</span></p>
                <button
                  onClick={() => router.push(`/appointments/${doc._id}`)}
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
