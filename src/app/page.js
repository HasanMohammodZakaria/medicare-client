import Banner from "@/components/home/Banner";
import FeaturedDoctors from "@/components/home/featuredDoctors";
import MedicalSpecializations from "@/components/home/MedicalSpecializations";
import WhyChooseUs from "@/components/home/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <Banner />
      <MedicalSpecializations />
      <FeaturedDoctors />
      <WhyChooseUs />
    </div>
  );
}
