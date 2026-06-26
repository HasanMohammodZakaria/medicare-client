import AllDoctors from "@/components/doctor/AllDoctors";
import { getDoctors, getSpecializations } from "../lib/actions/public.actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Find Doctors | MediNexa" };

export default async function FindDoctorsPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const specialization = params?.specialization || "";
  const sortBy = params?.sortBy || "";

  const [doctors, specializations] = await Promise.all([
    getDoctors({ search, specialization, sortBy }),
    getSpecializations(),
  ]);

  return (
    <AllDoctors
      initialDoctors={doctors}
      specializations={specializations}
      initialFilters={{
        search,
        specialization: specialization || "all",
        sortBy: sortBy || "newest",
      }}
    />
  );
}
