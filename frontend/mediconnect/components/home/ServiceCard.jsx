export default function ServiceCard({ title, icon }) {
  return (
    <div className="flex flex-col items-start p-8 bg-transparent border border-[#5F6FFF] rounded-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer min-h-[220px]">
      {/* Icon Placeholder - You can replace these with Lucide-React or SVGs */}
      <div className="mb-6 text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 leading-tight">
        {title}
      </h3>
    </div>
  );
}