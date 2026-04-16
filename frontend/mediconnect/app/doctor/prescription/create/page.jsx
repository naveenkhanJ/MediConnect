"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Plus, Trash2, FileText, Stethoscope } from "lucide-react";

export default function CreatePrescriptionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const appointmentId = searchParams.get("appointmentId");

  const [medications, setMedications] = useState([
    { name: "", dose: "" },
  ]);

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const addMedicine = () => {
    setMedications([...medications, { name: "", dose: "" }]);
  };

  const removeMedicine = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const handleChange = (i, field, value) => {
    const updated = [...medications];
    updated[i][field] = value;
    setMedications(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.post("http://localhost:4000/api/prescriptions", {
        appointmentId,
        medications,
        notes,
      });

      alert("Prescription created successfully");

      router.push("/doctor/appointments");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Prescription already exists for this appointment");
        return;
      }
      console.error(err);
      alert("Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Stethoscope size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create Prescription</h1>
            <p className="text-sm text-gray-500">
              Appointment ID: {appointmentId}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border">

          {/* Medications Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <FileText size={18} /> Medications
              </h2>

              <button
                onClick={addMedicine}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {medications.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 mb-3 items-center"
              >
                <input
                  className="col-span-5 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Medicine name"
                  value={m.name}
                  onChange={(e) =>
                    handleChange(i, "name", e.target.value)
                  }
                />

                <input
                  className="col-span-5 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Dose (e.g. 1-0-1)"
                  value={m.dose}
                  onChange={(e) =>
                    handleChange(i, "dose", e.target.value)
                  }
                />

                <button
                  onClick={() => removeMedicine(i)}
                  className="col-span-2 flex justify-center text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="font-medium text-gray-700">
              Doctor Notes
            </label>
            <textarea
              className="w-full mt-2 border rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Add diagnosis, advice, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Saving..." : "Create Prescription"}
          </button>
        </div>
      </div>
    </div>
  );
}