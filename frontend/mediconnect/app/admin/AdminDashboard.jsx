"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { apiFetch } from "@/lib/api";

export default function AdminDashboard() {
  const { user } = useContext(AppContext);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [activeTab, setActiveTab] = useState("doctors"); // "doctors" | "patients"
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "verified"

  useEffect(() => {
    // Basic auth check
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : user;

    if (parsedUser && parsedUser.role !== "admin") {
      router.replace("/");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docs, pts] = await Promise.all([
        apiFetch("/api/admin/doctors", { auth: true }),
        apiFetch("/api/admin/patients", { auth: true }),
      ]);
      setDoctors(Array.isArray(docs) ? docs : []);
      setPatients(Array.isArray(pts) ? pts : []);
    } catch (err) {
      console.error("Failed to fetch data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setActionId(id);
    try {
      await apiFetch(`/api/admin/doctors/${id}/verify`, { auth: true, method: "PATCH" });
      setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, isVerified: true } : d)));
    } catch (err) {
      alert(err.message || "Failed to verify doctor.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Revoke this doctor's verification and login access?")) return;
    setActionId(id);
    try {
      await apiFetch(`/api/admin/doctors/${id}/reject`, { auth: true, method: "PATCH" });
      setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, isVerified: false } : d)));
    } catch (err) {
      alert(err.message || "Failed to reject doctor.");
    } finally {
      setActionId(null);
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    if (filter === "pending") return !d.isVerified;
    if (filter === "verified") return d.isVerified;
    return true;
  });

  const pendingCount = doctors.filter((d) => !d.isVerified).length;
  const verifiedCount = doctors.filter((d) => d.isVerified).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage users, registrations and approvals</p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Total Doctors</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{doctors.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-yellow-100">
            <p className="text-sm text-yellow-600 font-medium font-medium">Pending Approval</p>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
               <span className="text-xs text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100 translate-y-[-4px]">Action Required</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
            <p className="text-sm text-green-600 font-medium">Verified Doctors</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{verifiedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Total Patients</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{patients.length}</p>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex border-b border-gray-200 mb-6 px-1">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 translate-y-[1px] ${
              activeTab === "doctors"
                ? "border-[#5F6FFF] text-[#5F6FFF]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Doctors Management
          </button>
          <button
            onClick={() => setActiveTab("patients")}
            className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 translate-y-[1px] ${
              activeTab === "patients"
                ? "border-[#5F6FFF] text-[#5F6FFF]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Patients Directory
          </button>
        </div>

        {/* Sub-Filters for Doctors */}
        {activeTab === "doctors" && (
          <div className="flex gap-2 mb-6">
            {["all", "pending", "verified"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition border ${
                  filter === tab
                    ? "bg-[#5F6FFF] text-white border-[#5F6FFF]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Generic Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-[#5F6FFF]/20 border-t-[#5F6FFF] rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 animate-pulse">Loading secure data...</p>
            </div>
          ) : activeTab === "doctors" ? (
            <div className="overflow-x-auto">
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-sm italic">No doctors match the selected filter.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Doctor Info</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Speciality / License</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Type / Fees</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-700">Approval Status</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50/50 transition duration-150">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-950">{doc.fullName || "Unnamed Doctor"}</div>
                          <div className="text-xs text-gray-500">{doc.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 font-medium">{doc.speciality || "—"}</div>
                          <div className="text-[10px] text-[#5F6FFF] bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1 font-mono uppercase tracking-wider">{doc.licenseNumber || "NO-LICENSE"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700">{doc.consultationType || "—"}</div>
                          <div className="text-xs text-gray-400 font-medium">LKR {doc.fees || 0}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {doc.isVerified ? (
                            <div className="flex flex-col items-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                  APPROVED
                                </span>
                                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Login Access: Active</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                  PENDING
                                </span>
                                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Login Access: Blocked</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            {!doc.isVerified ? (
                              <button
                                onClick={() => handleVerify(doc.id)}
                                disabled={actionId === doc.id}
                                className="px-4 py-1.5 bg-[#5F6FFF] text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition disabled:opacity-50"
                              >
                                {actionId === doc.id ? "Working..." : "Approve Account"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReject(doc.id)}
                                disabled={actionId === doc.id}
                                className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                              >
                                {actionId === doc.id ? "Working..." : "Revoke Access"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
               {patients.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-sm italic">No patients registered in the system.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Patient Name</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Contact Details</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Demographics</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-700">Registered On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {patients.map((pat) => (
                      <tr key={pat.id} className="hover:bg-gray-50/50 transition duration-150">
                        <td className="px-6 py-4 font-semibold text-gray-900">{pat.name}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{pat.email}</div>
                          <div className="text-xs text-gray-500">{pat.contact || "No Contact"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                             <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded capitalize">{pat.gender || "—"}</span>
                             <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{pat.age || "?"} Years</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-400 text-xs font-mono">
                          {pat.createdAt ? new Date(pat.createdAt).toLocaleDateString() : "Historical Data"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
