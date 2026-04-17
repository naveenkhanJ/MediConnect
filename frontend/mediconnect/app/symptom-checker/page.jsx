"use client";

import { useState } from "react";
import axios from "axios";

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!symptoms.trim()) {
      alert("Please enter symptoms");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post(
        "http://localhost:4000/api/symptoms/check",
        { symptoms }
      );

      setResult(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze symptoms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-4 text-center">
          AI Symptom Checker
        </h1>

        {/* Input Card */}
        <div className="bg-white shadow-md rounded-xl p-5 mb-6">
          <label className="block text-gray-700 mb-2">
            Enter your symptoms
          </label>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. fever, headache, sore throat..."
            className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleCheck}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded-lg text-white font-semibold ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Analyzing..." : "Check Symptoms"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white shadow-md rounded-xl p-5 space-y-4">

            <h2 className="text-xl font-semibold mb-2">
              Analysis Result
            </h2>

            {/* Conditions */}
            <div>
              <h3 className="font-medium text-gray-700">
                Possible Conditions:
              </h3>
              <ul className="list-disc ml-5 text-gray-600">
                {result.possibleConditions?.length > 0 ? (
                  result.possibleConditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))
                ) : (
                  <li>No data</li>
                )}
              </ul>
            </div>

            {/* Severity */}
            <div>
              <h3 className="font-medium text-gray-700">Severity:</h3>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                {result.severity}
              </span>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="font-medium text-gray-700">
                Recommended Specialties:
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.recommendedSpecialties?.map((s, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div>
              <h3 className="font-medium text-gray-700">Advice:</h3>
              <p className="text-gray-600">{result.advice}</p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-red-500 mt-4">
              ⚠ This is not a medical diagnosis. Please consult a doctor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}