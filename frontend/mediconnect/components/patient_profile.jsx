"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { deleteMyPatientAccount, getMyPatientProfile, updateMyPatientProfile } from "../lib/patientProfileApi";

export default function ProfileUpdatePage() {
  const router = useRouter();

  // Initialize state with existing user data
  const [userData, setUserData] = useState({
    title: "Mr.",
    email: "",
    mobile: "+1 234 567 8900",
    displayName: "John Doe",
    gender: "Male",
    age: "35"
  });

  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please login to view your profile.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const data = await getMyPatientProfile(token);

        setPatientId(data?.id ?? null);

        setUserData((prev) => ({
          ...prev,
          displayName: data?.name ?? prev.displayName,
          email: data?.email ?? prev.email,
          mobile: data?.contact ?? prev.mobile,
          gender: data?.gender ?? prev.gender,
          age: data?.age != null ? String(data.age) : prev.age,
        }));
      } catch (e) {
        setError("Something went wrong while loading profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteAccount = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please login again.");
      setShowDeleteModal(false);
      return;
    }
    if (!patientId) {
      setError("Patient profile not loaded yet.");
      setShowDeleteModal(false);
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await deleteMyPatientAccount(token, patientId);

      // cleanup session + redirect to home
      localStorage.removeItem("token");
      setShowDeleteModal(false);
      router.replace("/");
    } catch (e) {
      setError(e?.message || "Something went wrong while deleting account.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please login again.");
      return;
    }
    if (!patientId) {
      setError("Patient profile not loaded yet.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const name = userData.displayName?.trim() || "";

      await updateMyPatientProfile(token, patientId, {
        name,
        email: userData.email,
        age: userData.age ? Number(userData.age) : null,
        gender: userData.gender,
        contact: userData.mobile,
      });

      setSuccess("Profile updated successfully.");
    } catch (e) {
      setError(e?.message || "Something went wrong while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  p-4  font-sans text-slate-700 mt-16 border border-gray-200">
      <div className="max-w-4xl bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100/50 p-2 border-b border-gray-200 p ">
          <button className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-t-lg font-medium text-sm">Profile</button>
          <button className="flex-1 py-3 px-4 text-gray-500 hover:bg-gray-200 transition text-sm">Change Password</button>
          <button className="flex-1 py-3 px-4 text-gray-500 hover:bg-gray-200 transition text-sm">Email Notification</button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 py-3 px-4 text-red-600 hover:bg-red-50 transition text-sm font-medium"
          >
            Delete Account
          </button>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Profile Settings</h1>
          <div className="border-b border-gray-100 mb-8"></div>

          {loading && (
            <div className="mb-6 text-sm text-slate-500">Loading profile...</div>
          )}
          {!loading && error && (
            <div className="mb-6 text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && success && (
            <div className="mb-6 text-sm text-green-700">{success}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6">Information</h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Title Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">Title</label>
                <select 
                  name="title"
                  value={userData.title}
                  onChange={handleChange}
                  className="p-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                >
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Dr.</option>
                </select>
              </div>

              {/* Display Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">Display Name</label>
                <input 
                  type="text"
                  name="displayName"
                  value={userData.displayName}
                  onChange={handleChange}
                  className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600">Mobile Number</label>
                <input 
                  type="text"
                  name="mobile"
                  value={userData.mobile}
                  onChange={handleChange}
                  className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Gender & Age Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Gender</label>
                  <select 
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                    className="p-3 bg-white border border-gray-200 rounded-lg outline-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Age</label>
                  <input 
                    type="number"
                    name="age"
                    value={userData.age}
                    onChange={handleChange}
                    className="p-3 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="mt-12 flex justify-end">
              <button 
                type="submit"
                disabled={loading || deleting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg font-semibold shadow-md shadow-blue-200 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800">Delete account?</h2>
              <p className="mt-2 text-sm text-slate-600">
                This action is permanent. Your profile and related data will be removed.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-slate-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}