import {
  getDoctorAppointments,
  getDoctorOverview,
} from "@/app/lib/actions/doctor.action";
import { auth } from "@/app/lib/auth";
import DoctorOverviewClient from "@/components/doctor/DoctorOverview";
import { headers } from "next/headers";

export const metadata = { title: "Doctor Dashboard | MediNexa" };

export default async function DoctorOverviewPage() {
  const [overview, appointments, session] = await Promise.all([
    getDoctorOverview(),
    getDoctorAppointments(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  return (
    <DoctorOverviewClient
      overview={overview ?? {}}
      appointments={appointments ?? []}
      doctor={session?.user ?? {}}
    />
  );
}
