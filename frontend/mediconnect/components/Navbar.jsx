"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { COLORS } from "@/style/color";
import Link from "next/link";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full  backdrop-blur-sm shadow-sm bg-white/80 py-4 lg:px-20 px-12 fixed  z-50 bg-gradient-to-b from-[#f7f9fb] to-white">
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
           <Link href="/">Home</Link>
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold ">
            <Link href="/doctor">Doctors</Link>
          </li>
           <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold">
            <Link href="/services">Services</Link>
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold ">
            <Link href="/about">About</Link>
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold">
            <Link href="/contact">Contact</Link>
          </li>
         
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">

          <Link href="/Auth/login">
          <button  className="text-primary font-medium cursor-pointer border border-[#5F6FFF] px-6 py-2 rounded-full text-sm ">
            Sign In
          </button>
          </Link>
          
          
          <Link href="/Auth/register">
          <button
            className="text-white px-6 py-2 cursor-pointer rounded-full text-sm font-medium"
            style={{ backgroundColor: COLORS.primary }}
          >
            Register
          </button>
          </Link>
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