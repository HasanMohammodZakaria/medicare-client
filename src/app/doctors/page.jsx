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
