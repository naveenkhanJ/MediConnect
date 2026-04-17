"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";
import { Send } from "lucide-react"; // keep lucide for UI icons

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#eef2f7] to-[#e9f0f8] pt-16 pb-6 px-6 md:px-16">
      
      {/* TOP GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

        {/* Documentation */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Documentation</h3>
          <ul className="space-y-3 text-gray-600">
            <li>Medical</li>
            <li>Operation</li>
            <li>Laboratory</li>
            <li>ICU</li>
          </ul>
        </div>

        {/* Treatments */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Treatments</h3>
          <ul className="space-y-3 text-gray-600">
            <li>Neurology</li>
            <li>Cardiologist</li>
            <li>Dentist</li>
            <li>Urology</li>
          </ul>
        </div>

        {/* Specialities */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Specialities</h3>
          <ul className="space-y-3 text-gray-600">
            <li>Neurology</li>
            <li>Cardiologist</li>
            <li>Dentist</li>
            <li>Urology</li>
          </ul>
        </div>

        {/* Utilities */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Utilites</h3>
          <ul className="space-y-3 text-gray-600">
            <li>Medical</li>
            <li>Operation</li>
            <li>Laboratory</li>
            <li>ICU</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-600 text-sm mb-4">
            Subscribe & Stay Updated from the Doccure
          </p>

          {/* Input */}
          <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm">
            <input
              type="email"
              placeholder="Enter Email"
              className="flex-1 px-4 py-2 text-sm outline-none"
            />
            <button className="bg-[#2B7FFF] text-white px-4 py-2 flex items-center gap-2">
              <Send size={16} />
              Send
            </button>
          </div>

          {/* Social */}
          <div className="mt-6">
            <p className="text-gray-700 mb-3">Connect With Us</p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-[#5F6FFF] hover:text-white transition cursor-pointer"
                >
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm gap-4">
        <p>© 2026 Doccure. All rights reserved.</p>

        <div className="flex items-center gap-4">
          <span>Terms and Conditions</span>
          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
          <span>Privacy Policy</span>
        </div>
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full border border-blue-500 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition"
      >
        ↑
      </button>
    </footer>
  );
}