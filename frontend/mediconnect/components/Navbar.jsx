"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { COLORS } from "@/style/color";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full  shadow-sm  py-4 lg:px-20 px-12 fixed  z-50 bg-white ">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="text-white p-2 rounded-lg"
            style={{ backgroundColor: COLORS.primary }}
          >
            ✨
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Prescripto
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
          <li className="cursor-pointer hover:text-[#5F6FFF]  hover:border-b-2 text-bold border-primary pb-1">
            Home
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold ">
            Doctors
          </li>
           <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold">
            Services
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold ">
            About
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold">
            Contact
          </li>
         
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-primary font-medium cursor-pointer border border-[#5F6FFF] px-6 py-2 rounded-full text-sm ">
            Sign In
          </button>

          <button
            className="text-white px-6 py-2 cursor-pointer rounded-full text-sm font-medium"
            style={{ backgroundColor: COLORS.primary }}
          >
            Register
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-gray-700 font-medium bg-gray-200">
          <p>Home</p>
          <p>Doctors</p>
          <p>Services</p>
          <p>About</p>
          <p>Contact</p>

          <div className="flex flex-col gap-2 mt-2">
            <button className="text-primary text-left">Sign In</button>

            <button
              className="text-white px-4 py-2 rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}