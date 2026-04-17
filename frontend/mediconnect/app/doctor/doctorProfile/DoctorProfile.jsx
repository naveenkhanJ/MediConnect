"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { apiUrl } from "@/lib/api";

const API = apiUrl("/api/profile/me");

export default function DoctorProfileAdvanced() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.get(API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(API, form);
      setProfile(res.data);
      setEdit(false);
      setError("");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (!profile) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading doctor profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 border">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {profile.fullName?.charAt(0)}
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Dr. {profile.fullName}
              </h1>

              <p className="text-gray-500">{profile.speciality}</p>
              <p className="text-xs text-gray-400">{profile.email}</p>

              <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-block ${
                profile.isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {profile.isVerified ? "Verified" : "Pending"}
              </span>
            </div>

          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            {edit ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 mt-6">

        {/* MAIN FORM */}
        <div className="col-span-2 bg-white shadow-xl rounded-3xl p-6 border">

          <h2 className="text-lg font-semibold mb-4">Profile Details</h2>

          <div className="grid grid-cols-2 gap-4">

            {/* FULL NAME */}
            <input
              name="fullName"
              value={form.fullName || ""}
              onChange={handleChange}
              disabled={!edit}
              className="p-3 border rounded-xl disabled:bg-gray-100"
              placeholder="Full Name"
            />

            {/* PHONE */}
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              disabled={!edit}
              className="p-3 border rounded-xl disabled:bg-gray-100"
              placeholder="Phone"
            />

            {/* EMAIL (LOCKED) */}
            <input
              value={profile.email}
              disabled
              className="p-3 border rounded-xl bg-gray-100"
              placeholder="Email"
            />

            {/* SPECIALITY (LOCKED) */}
            <input
              value={profile.speciality}
              disabled
              className="p-3 border rounded-xl bg-gray-100"
              placeholder="Speciality"
            />

            {/* LICENSE (LOCKED) */}
            <input
              value={profile.licenseNumber}
              disabled
              className="p-3 border rounded-xl bg-gray-100"
              placeholder="License Number"
            />

            {/* CONSULTATION TYPE */}
            <select
              name="consultationType"
              value={form.consultationType || ""}
              onChange={handleChange}
              disabled={!edit}
              className="p-3 border rounded-xl disabled:bg-gray-100"
            >
              <option value="PHYSICAL">PHYSICAL</option>
              <option value="ONLINE">ONLINE</option>
              <option value="BOTH">BOTH</option>
            </select>

            {/* FEES */}
            <input
              name="fees"
              value={form.fees || ""}
              onChange={handleChange}
              disabled={!edit}
              className="p-3 border rounded-xl disabled:bg-gray-100"
              placeholder="Fees"
            />

            {/* EXPERIENCE */}
            <input
              name="experience"
              value={form.experience || ""}
              onChange={handleChange}
              disabled={!edit}
              className="p-3 border rounded-xl disabled:bg-gray-100"
              placeholder="Experience (years)"
            />

            {/* BIO */}
            <textarea
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              disabled={!edit}
              className="col-span-2 p-3 border rounded-xl h-28 disabled:bg-gray-100"
              placeholder="Bio"
            />

          </div>

          {edit && (
            <button
              onClick={handleSave}
              className="mt-4 px-5 py-2 bg-green-600 text-white rounded-xl"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* SIDE PANEL */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border">

          <h2 className="text-lg font-semibold mb-4">Quick Info</h2>

          <div className="space-y-3 text-sm">

            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400">Doctor ID</p>
              <p className="font-semibold">{profile.id}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400">Consultation</p>
              <p className="font-semibold">{profile.consultationType}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400">Status</p>
              <p className={profile.isVerified ? "text-green-600" : "text-yellow-600"}>
                {profile.isVerified ? "Verified" : "Pending"}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}