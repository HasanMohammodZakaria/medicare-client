// import Banner from "@/components/home/Banner";
// import FeaturedDoctors from "@/components/home/FeaturedDoctors";

// import MedicalSpecializations from "@/components/home/MedicalSpecializations";
// import WhyChooseUs from "@/components/home/WhyChooseUs";
// import { getFeaturedDoctors } from "./lib/actions/public.actions";
// import { Suspense } from "react";


// export default async function Home() {
//   const featuredDoctors = await getFeaturedDoctors();
//   return (
//     <div>
//       <Banner />
//       <MedicalSpecializations />
//       <Suspense fallback={<FeaturedDoctors loading={true} />}>
//         <FeaturedDoctors doctors={featuredDoctors} />
//       </Suspense>
//       <WhyChooseUs />
//     </div>
//   );
// }


// app/page.jsx


import Banner from "@/components/home/Banner";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import MedicalSpecializations from "@/components/home/MedicalSpecializations";
import PatientReviews from "@/components/home/PatientReviews";
import PlatformStats from "@/components/home/PlatformStats";
import WhyChooseUs from "@/components/home/WhyChooseUs";



export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedDoctors />
      <MedicalSpecializations />
      <PlatformStats />
      <PatientReviews />
      <WhyChooseUs />
    </div>
  );
}