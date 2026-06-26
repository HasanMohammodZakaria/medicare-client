import Banner from "@/components/home/Banner";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";

import MedicalSpecializations from "@/components/home/MedicalSpecializations";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { getFeaturedDoctors } from "./lib/actions/public.actions";


export default async function Home() {
  const featuredDoctors = await getFeaturedDoctors();
  return (
    <div>
      <Banner />
      <MedicalSpecializations />
      <FeaturedDoctors doctors={featuredDoctors} />
      <WhyChooseUs />
    </div>
  );
}
