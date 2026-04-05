"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import serviceImg from "../../public/images/onl3.webp";
import { services } from "@/assets/data";



export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(2);

  const toggleService = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="w-full px-6 md:px-16 py-12 bg-gradient-to-r from-[#f3f4fb] to-white  ">
    
      
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* LEFT SIDE - SERVICES */}
        <div>
          <h4 className="bg-gray-200 text-[#5F6FFF] py-1 px-4 rounded-full inline-block">
            our services
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 mt-6">
            Caring Beyond Dentistry
          </h2>

          <div className="gap-4 flex flex-col  ">
            {services.map((service, index) => (
              <div
                key={index}
                className=" text-xl cursor-pointer px-4 py-4 mt-2 rounded-lg transition-all duration-300 hover:shadow-lg border border-gray-100   hover:bg-gradient-to-r from-[#EEF0FF] to-white "
                onClick={() => toggleService(index)}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-800">
                    {service.title}
                  </p>

                  {/* Arrow */}
                  <span
                    className={`transition-transform ${
                      activeIndex === index ? "rotate-90" : ""
                    }`}
                  >
                    <ChevronRight size={18} className="text-[#5F6FFF]" />
                  </span>
                </div>

                {/* Description */}
                {activeIndex === index && (
                  <p className="text-sm text-gray-500 mt-2">
                    {service.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="ml-8 max-w-[550px] ">
          {/* Top description */}
          <p className="text-gray-900 mb-8 ]  mt-14 ">
            Stay relaxed and experience complete comfort during every visit, knowing that your care is our top priority. We aim to create a calm and welcoming environment where all your concerns are addressed with clarity and ease, providing simple and understandable answers to your questions
          </p>

          {/* Image */}
          <div className=" rounded-xl shadow-md p-4  bg-gray-50 ">
            <Image
              src={serviceImg}
            
              alt="doctor"
              className="rounded-lg  object-cover"
            />

            {/* Quick navigation cards */}
            <div className="mt-4 gap-3 flex flex-col">

              {[
                "Preventive Care Consultation",
                "Follow Up Consultation",
                "Emergency Consultation",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item}
                    </p>
                    <p className="text-xs text-gray-500">
                      30 minutes consultation with a specialist
                    </p>
                  </div>

                  <button className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-[#5F6FFF] hover:text-white transition">
                    →
                  </button>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}