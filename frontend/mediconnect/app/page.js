
import Hero from "@/components/home/Hero";
import DoctorCard from "@/components/home/doctorCard";
import Services from "@/app/services/page";
import TestimonialsSection from "@/components/Testimornial";

export default function Home() {
  return (
    <div> 
      <Hero />
      <DoctorCard />
      <Services />
      <TestimonialsSection/>
    </div> 
    
      

  );
}
