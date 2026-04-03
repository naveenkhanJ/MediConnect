import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-[#EEF0FF] to-white flex items-center lg:px-20 md:px-16 px-12 ">
      <div className="grid md:grid-cols-2 gap-10 items-center w-full">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* Badge */}
          <div className="inline-block bg-gradient-to-r from-white to-[#f5f5f5] text-gray-600 px-4 py-2 rounded-full text-sm">
            Consultant top doctors anytime, from any location
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Your Health in Your Hands, <br />
            <span className="text-[#5F6FFF]">Every Step of the Way</span>
          </h1>

          {/* Description */}
          <p className="text-gray-500 text-base max-w-lg">
            We offers 24/7 access to healthcare services, empowering you to stay healthy without stepping outside.
          </p>

          {/* Button */}
          <button className="bg-[#5F6FFF] text-white px-6 py-3 rounded-full shadow-md hover:opacity-90 transition">
            Schedule an appointment
          </button>

          {/* Stats */}
          <div className="flex gap-4 pt-4">
            <div className="bg-gradient-to-r from-white to-[#f5f5f5] p-4 rounded-md">
              <h2 className="text-3xl font-bold">35+</h2>
              <p className="text-gray-500 text-sm">Certified specialists</p>
            </div>
            <div className="bg-gradient-to-r from-white to-[#f5f5f5] p-4 rounded-md">
              <h2 className="text-3xl font-bold">12+</h2>
              <p className="text-gray-500 text-sm">Years experience</p>
            </div>
            <div className="bg-gradient-to-r from-white to-[#f5f5f5] p-4 rounded-md">
              <h2 className="text-3xl font-bold">10K+</h2>
              <p className="text-gray-500 text-sm">Care with services</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center">

          {/* Doctor Image */}
          <Image
            src="/hero.jpg"
            alt="doctor"
            width={700}
            height={700}
            className="rounded-2xl"
          />

          {/* Floating Card */}
          <div className="absolute bottom-10 left-[-10]  bg-gradient-to-r from-white to-[#daddf3] p-4 rounded-xl shadow-lg">
            <p className="text-md text
            -gray-500 font-bold">Latest visit Doctor</p>

            <h2 className="text-2xl font-bold">790+</h2>
            <p className="text-sm text-gray-500">Care with Services</p>
          </div>

          {/* Floating Icons */}
    

        </div>
      </div>
    </section>
  );
}
