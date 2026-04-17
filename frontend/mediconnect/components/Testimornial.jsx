'use client'

import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    title: "Nice Treatment",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    name: "Jennifer Robinson",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Great Support",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    name: "Michael Brown",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    title: "Highly Recommended",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    name: "Sophia Lee",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
 
];

const stats = [
  { value: 500, suffix: "+", label: "Doctors Available", color: "bg-green-500" },
  { value: 18, suffix: "+", label: "Specialities", color: "bg-purple-500" },
  { value: 30000, suffix: "K", label: "Bookings Done", color: "bg-blue-500" },
  { value: 97, suffix: "+", label: "Hospitals & Clinic", color: "bg-red-500" },
  { value: 317, suffix: "+", label: "Lab Tests Available", color: "bg-yellow-400" },
];

function useCountUp(target, trigger) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [trigger, target]);

  return count;
}

export default function TestimonialsSection() {
  const statsRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <section className="w-full py-16 bg-gradient-to-r from-[#EEF0FF] to-white">
      <div className="max-w-7xl mx-auto px-6 text-center ">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block px-4 py-1 text-sm text-white bg-blue-500 rounded-full">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#2E3842]">
            15k Users Trust Doccure Worldwide
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 text-left relative max-w-700"
            >
              <div className="flex mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
              </div>

              <div className="absolute top-4 right-4 text-orange-400 text-3xl font-bold">
                “
              </div>

              <h3 className="font-semibold text-[#2E3842] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{item.text}</p>

              <div className="flex items-center gap-3">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-semibold text-[#2E3842]">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, index) => {
            const count = useCountUp(stat.value, visible);

            return (
              <div key={index} className="text-center">
                <h3 className="text-2xl font-bold text-[#2E3842]">
                  {stat.label === "Bookings Done"
                    ? `${Math.floor(count / 1000)}K`
                    : `${count}${stat.suffix}`}
                </h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <div className={`mt-2 h-1 w-10 mx-auto ${stat.color} rounded`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
