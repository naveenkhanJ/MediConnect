
import ServiceCard from '@/components/home/ServiceCard';
import {services }from '@/assets/data';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-transparent border border-[#1e32e7] py-16 px-4 sm:px-8 lg:px-16 ">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <p className="italic text-gray-600 text-sm mb-2 font-serif">Excellence is Our Specialty</p>
          <h1 className="text-3xl font-black text-gray-900 ">
            Discover Vivo Services
          </h1>
        </div>
        <button className="bg-[#5F6FFF]  text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors">
          View All Hospital Services
        </button>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {services.map((service, index) => (
          <ServiceCard 
            key={index} 
            title={service.title} 
            icon={<span className="text-4xl">{service.icon}</span>} 
          />
        ))}
      </div>
    </div>
  );
}