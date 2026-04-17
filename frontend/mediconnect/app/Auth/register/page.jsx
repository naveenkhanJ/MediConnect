"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    gender: "",
    birthday: "",
    licenseNo: "",
    fees: "",
    speciality: "",
    experience: "",
    bio: "",
    image: null,
    consultationType: "ONLINE",
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm({ ...form, [name]: type === "file" ? (files?.[0] ?? null) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate age from birthday
    const birthDate = new Date(form.birthday);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    try {
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          age: age,
          gender: form.gender,
          contact: form.phone,
          role,
          // Doctor specific fields (if role is doctor)
          license_no: form.licenseNo,
          speciality: form.speciality,
          fees: form.fees,
          experience: form.experience,
          consultationType: form.consultationType,
          bio: form.bio || "",
          image: form.image ? form.image.name : null 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Registration failed');
        return;
      }

      alert('Account created! Please login.');
      window.location.href = '/Auth/login';

    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-[#EEF0FF] to-white px-4 py-10 mt-10">
      
      <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl p-8">

        {/* 🔷 TOP HEADER */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#EEF0FF] rounded-full flex items-center justify-center mb-2">
            <span className="text-xl text-[#5F6FFF]">⚕️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            MediConnect
          </h2>
          <p className="text-sm text-gray-500">
            Doctor appointment management
          </p>
        </div>

        {/* 🔷 ROLE CARDS */}
        <div className="grid grid-cols-2 max-w-[300px]  mx-auto gap-8 mb-4">
          
          {/* Patient */}
          <div
            onClick={() => setRole("patient")}
            className={`cursor-pointer border rounded-xl p-4 h-20 w-40 flex flex-col items-center gap-2 transition
              ${
                role === "patient"
                  ? "border-[#5F6FFF] bg-[#EEF0FF]"
                  : "bg-gray-50"
              }`}
          >
            <span className="">👤</span>
            <p className="font-medium">Patient</p>
          </div>

          {/* Doctor */}
          <div
            onClick={() => setRole("doctor")}
            className={`cursor-pointer border rounded-xl p-4 flex h-20 w-40 flex-col items-center gap-2 transition
              ${
                role === "doctor"
                  ? "border-[#5F6FFF] bg-[#EEF0FF]"
                  : "bg-gray-50"
              }`}
          >
            <span className="text-xl">🩺</span>
            <p className="font-medium">Doctor</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Birthday */}
          <div>
            <label className="text-sm text-gray-600">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* 🔥 DOCTOR ONLY */}
          {role === "doctor" && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-600">License No</label>
                <input
                  name="licenseNo"
                  value={form.licenseNo}
                  onChange={handleChange}
                  placeholder="e.g. SLMC-12345"
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F6FFF] transition"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Consultation Fees (LKR)</label>
                <input
                  type="number"
                  name="fees"
                  value={form.fees}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F6FFF] transition"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Speciality</label>
                <select
                  name="speciality"
                  value={form.speciality}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F6FFF] transition appearance-none bg-white"
                  required
                >
                  <option value="">Select Speciality</option>
                  <option value="General physician">General physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600">Experience</label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5 Years"
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F6FFF] transition"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Consultation Availability</label>
                <select
                  name="consultationType"
                  value={form.consultationType}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F6FFF] transition appearance-none bg-white"
                  required
                >
                  <option value="ONLINE">💻 Online Only</option>
                  <option value="PHYSICAL">🏥 In-Person Only</option>
                  <option value="BOTH">🔄 Both Available</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600">Professional Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Briefly describe your medical background and expertise..."
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F6FFF] transition"
                  required
                ></textarea>
              </div>

              {/* 🖼️ IMAGE UPLOAD */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">
                  Upload Profile Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full mt-1"
                />
              </div>
            </>
          )}

          {/* Button */}
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-[#5F6FFF] text-white py-2 rounded-lg">
              Register
            </button>
          </div>
        </form>

        {/* Login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/Auth/login" className="text-[#5F6FFF] font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}