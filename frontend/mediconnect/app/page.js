import { Divide } from "lucide-react";
import Image from "next/image";
import Hero from "@/components/home/Hero";
import DoctorsSection from "@/components/home/Feature_doctor";
import { DoctorSearch } from "@/components/SearchBar";
import Services from "@/components/home/Services";

export default function Home() {
  return (
    <div> 
      <Hero />
      <DoctorSearch />
      <DoctorsSection />
    </div> 
    
      

  );
}
