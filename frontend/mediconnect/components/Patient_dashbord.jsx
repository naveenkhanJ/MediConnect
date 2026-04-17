"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Search,
  FileText,
  ExternalLink,
  Calendar,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getMyReports, uploadMyReport } from "../lib/reportsApi";

export default function Dashboard() {
  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [form, setForm] = useState({
    report_name: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setReportsError("Please login to view reports.");
        setLoadingReports(false);
        return;
      }
      try {
        setLoadingReports(true);
        setReportsError("");
        const data = await getMyReports(token);
        setReports(data);
      } catch (e) {
        setReportsError(e?.message || "Failed to load reports.");
      } finally {
        setLoadingReports(false);
      }
    };
    run();
  }, [token]);

  const handleOpenUpload = () => {
    setUploadError("");
    setUploadSuccess("");
    setForm({ report_name: "", description: "", file: null });
    setShowUpload(true);
  };

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!token) {
      setUploadError("Please login again.");
      return;
    }
    if (!form.report_name.trim()) {
      setUploadError("Report name is required.");
      return;
    }
    if (!form.file) {
      setUploadError("Please select a file.");
      return;
    }
    try {
      setUploading(true);
      setUploadError("");
      setUploadSuccess("");
      await uploadMyReport(token, form);
      setUploadSuccess("Report uploaded successfully.");
      const data = await getMyReports(token);
      setReports(data);
      setShowUpload(false);
    } catch (e2) {
      setUploadError(e2?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 mt-20 mr-10 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Good Morning, Lahiru!</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none text-sm"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <Bell className="w-5 h-5 text-gray-600" />
          <Image
            src="/images/man.png"
            alt="profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#4C6FFF] to-blue-400 text-white p-6 rounded-2xl mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold mb-2">
            Find the best doctors with Health Care
          </h2>
          <p className="text-sm opacity-90">
            Book appointments easily and stay healthy.
          </p>
        </div>
        <div className="w-32 h-24 bg-white/20 rounded-xl">
         
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="col-span-2 space-y-6">
          {/* Vitals */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Body Temperature", value: "36.2 °C" },
              { label: "Pulse", value: "85 bpm" },
              { label: "Blood Pressure", value: "80/70 mm/Hg" },
              { label: "Breathing Rate", value: "15 breaths/m" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-sm text-gray-500">{item.label}</p>
                <h3 className="text-lg font-semibold mt-1">{item.value}</h3>
              </div>
            ))}
          </div>

          {/* Appointments */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-4">Appointments</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500  ">
                <tr>
                  <th>Doctor</th>
                  <th>Specification</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Dr. John", spec: "Cardiologist", status: "conform" },
                  { name: "Dr. Smith", spec: "Dentist", status: "Upcoming" },
                  {
                    name: "Dr. Alex",
                    spec: "Neurologist",
                    status: "Completed",
                  },
                ].map((item, i) => (
                  <tr key={i} className="border-t border-gray-200 ">
                    <td className="py-3">{item.name}</td>
                    <td>{item.spec}</td>
                    <td>12 Dec</td>
                    <td>10:00 AM</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : item.status === "Upcoming"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-50 text-green-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-row gap-6">
            <Link href="/book-appointment">
              <button className="bg-[#4C6FFF] text-white text-sm px-4 py-3 rounded-lg">
                Book Appointment
              </button>
            </Link>

            <button
              type="button"
              onClick={handleOpenUpload}
              className="border text-sm px-4 py-3 rounded-lg"
            >
              Upload Report
            </button>
          </div>

          {/* My Reports */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-4">My Reports</h3>

            {loadingReports && (
              <div className="text-sm text-gray-500">Loading reports...</div>
            )}
            {!loadingReports && reportsError && (
              <div className="text-sm text-red-600">{reportsError}</div>
            )}
            {!loadingReports && !reportsError && reports.length === 0 && (
              <div className="text-sm text-gray-500">
                No reports uploaded yet.
              </div>
            )}
            {!loadingReports &&
              !reportsError &&
              reports.map((report) => (
                <div
                  key={report.id}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-6 h-6 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm truncate">
                        {report.report_name}
                      </div>
                      {report.description ? (
                        <div className="text-xs text-gray-400 truncate">
                          {report.description}
                        </div>
                      ) : null}
                      {report.created_at ? (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <span className="font-medium text-gray-600">
                            Created
                          </span>
                          <span>
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {report.file_url ? (
                    <a
                      href={report.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">No file</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Upload report
              </h2>
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="p-2 rounded-lg hover:bg-gray-50"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="p-6 space-y-4">
              {uploadError ? (
                <div className="text-sm text-red-600">{uploadError}</div>
              ) : null}
              {uploadSuccess ? (
                <div className="text-sm text-green-700">{uploadSuccess}</div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Report name
                </label>
                <input
                  value={form.report_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, report_name: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  placeholder="e.g., Blood test"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Description (optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 min-h-[90px]"
                  placeholder="Any notes about this report"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  File
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      file: e.target.files?.[0] || null,
                    }))
                  }
                  className="w-full text-sm"
                  accept=".pdf,image/*"
                />
                <div className="text-xs text-gray-400">
                  Allowed: PDF or images.
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-slate-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
