"use client";
import { useState, useContext } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { COLORS } from "@/style/color";
import Link from "next/link";
import { AppContext } from "@/context/AppContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AppContext);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className="w-full backdrop-blur-sm shadow-sm bg-white/80 py-4 lg:px-20 px-12 fixed z-50 bg-gradient-to-b from-[#f7f9fb] to-white">
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
            MediConnect
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold border-primary pb-1">
            <Link href="/">Home</Link>
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold">
            <Link href="/book-appointment">Doctors</Link>
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold">
            <Link href="/services">Services</Link>
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold">
            <Link href="/about">About</Link>
          </li>
          <li className="cursor-pointer hover:text-[#5F6FFF] hover:border-b-2 text-bold">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-[#5F6FFF] hover:bg-[#f0f1ff] transition text-sm font-medium text-gray-700"
              >
                <User size={16} className="text-[#5F6FFF]" />
                <span>{user.name}</span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link
                    href="/my-appointments"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f1ff] hover:text-[#5F6FFF]"
                  >
                    My Appointments
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/Auth/login">
                <button className="text-[#5F6FFF] font-medium cursor-pointer border border-[#5F6FFF] px-6 py-2 rounded-full text-sm hover:bg-[#f0f1ff] transition">
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
            </>
          )}
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
        <div className="md:hidden mt-4 flex flex-col gap-4 text-gray-700 font-medium px-2 pb-4">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/book-appointment" onClick={() => setIsOpen(false)}>Doctors</Link>
          <Link href="/services" onClick={() => setIsOpen(false)}>Services</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

          {user ? (
            <>
              <Link href="/my-appointments" onClick={() => setIsOpen(false)} className="text-[#5F6FFF] font-semibold">
                My Appointments
              </Link>
              <button onClick={handleLogout} className="text-red-500 text-left font-medium">
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/Auth/login" onClick={() => setIsOpen(false)}>
                <button className="text-[#5F6FFF] font-medium border border-[#5F6FFF] px-4 py-2 rounded-full w-full">
                  Sign In
                </button>
              </Link>
              <Link href="/Auth/register" onClick={() => setIsOpen(false)}>
                <button
                  className="text-white px-4 py-2 rounded-full w-full font-medium"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}