// import AllDoctors from "@/components/doctor/AllDoctors";
// import { getDoctors, getSpecializations } from "../lib/actions/public.actions";

// export const dynamic = "force-dynamic";

// export const metadata = { title: "Find Doctors | MediNexa" };

// export default async function FindDoctorsPage({ searchParams }) {
//   const params = await searchParams;
//   const search = params?.search || "";
//   const specialization = params?.specialization || "";
//   const sortBy = params?.sortBy || "";

//   const [doctors, specializations] = await Promise.all([
//     getDoctors({ search, specialization, sortBy }),
//     getSpecializations(),
//   ]);

//   return (
//     <AllDoctors
//       initialDoctors={doctors}
//       specializations={specializations}
//       initialFilters={{
//         search,
//         specialization: specialization || "all",
//         sortBy: sortBy || "newest",
//       }}
//     />
//   );
// }

// app/doctors/page.jsx
// কাজ: Find Doctors page — server component, data fetch করে AllDoctors এ পাঠায়

import {
  getDoctors,
  getSpecializations,
} from "@/app/lib/actions/public.actions";
import AllDoctors from "@/components/doctor/AllDoctors";

export const metadata = { title: "Find Doctors | MediNexa" };

export default async function FindDoctorsPage({ searchParams }) {
  const params = await searchParams;

  const search = params.search || "";
  const specialization = params.specialization || "all";
  const sortBy = params.sortBy || "newest";
  const page = parseInt(params.page) || 1;
  const limit = 10;

  const [result, specializations] = await Promise.all([
    getDoctors({ search, specialization, sortBy, page, limit }),
    getSpecializations(),
  ]);

  const doctors = result?.doctors ?? [];
  const totalDoctors = result?.pagination?.total ?? 0;
  const totalPages = result?.pagination?.totalPages ?? 1;

  return (
    <AllDoctors
      initialDoctors={doctors}
      totalDoctors={totalDoctors}
      totalPages={totalPages}
      specializations={specializations}
      initialFilters={{ search, specialization, sortBy, page }}
    />
  );
}
