"use client";

import { useState } from "react";
import Link from "next/link";

export default function DoctorRegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    gender: "",
    birthday: "",
    licenseNumber: "",
    speciality: "",
    category: "",
    experience: "",
    consultationType: "",
    fees: "",
    bio: "",
  });

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!image) return "";

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mediconnect_upload");

    setUploading(true);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const file = await res.json();
    setUploading(false);

    return file.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  stop if validation fails
    if (!validate()) return;

    try {
      const imageUrl = await uploadImage();

      const response = await fetch("http://localhost:4000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_TOKEN_HERE",
        },
        body: JSON.stringify({
          ...form,
          gender: form.gender.toUpperCase(),
          experience: Number(form.experience),
          fees: Number(form.fees),
          image: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Doctor registered successfully!");
      window.location.href = "/Auth/login";
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#EEF0FF] to-white px-4 py-10">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl p-8">

        <h2 className="text-3xl font-bold text-center mb-6">
          Doctor Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          {/* FULL NAME */}
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="input"
            required
          />

          {/* EMAIL */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="input"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="input"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="input md:col-span-2"
          />

          <select name="gender" onChange={handleChange} className="input">
            <option value="">Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            type="date"
            name="birthday"
            onChange={handleChange}
            className="input"
          />

          <input
            name="licenseNumber"
            placeholder="License Number"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            name="speciality"
            placeholder="Speciality"
            onChange={handleChange}
            className="input"
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="input"
          />

          <input
            name="experience"
            type="number"
            placeholder="Experience"
            onChange={handleChange}
            className="input"
          />

          <select
            name="consultationType"
            onChange={handleChange}
            className="input"
          >
            <option value="">Consultation Type</option>
            <option value="PHYSICAL">Physical</option>
            <option value="ONLINE">Online</option>
            <option value="BOTH">Both</option>
          </select>

          <input
            name="fees"
            type="number"
            placeholder="Fees"
            onChange={handleChange}
            className="input"
          />

          {/* IMAGE */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="input"
            />
          </div>

          <textarea
            name="bio"
            placeholder="Bio"
            onChange={handleChange}
            className="input md:col-span-2"
          />

          <button
            type="submit"
            disabled={uploading}
            className="md:col-span-2 bg-[#5F6FFF] text-white py-2 rounded-lg"
          >
            {uploading ? "Uploading..." : "Register Doctor"}
          </button>
        </form>

      </div>
    </div>
  );
}