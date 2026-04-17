"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!patientId) return;

    fetch(`http://localhost:4000/api/patients/reports`, {
      headers: { Authorization: "mock-token" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReports(data);
        else if (data?.reports) setReports(data.reports);
        else setReports([]);
      })
      .catch((err) => console.error(err));
  }, [patientId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">
        Patient Reports ({patientId})
      </h2>

      <div className="bg-white p-5 rounded shadow">
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports found</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Report ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.title || "Medical Report"}</td>
                  <td className="p-3">{r.createdAt?.split("T")[0]}</td>

                  <td className="p-3 text-center">
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      View File
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}