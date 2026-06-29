export const dynamic = "force-dynamic";
import { getDoctorSchedule } from "@/app/lib/actions/doctor.action";
import DoctorSchedulePage from "@/components/doctor/DoctorSchedule";

export const metadata = { title: "Manage Schedule | MediNexa" };

export default async function DoctorSchedule({ doctorId }) {
  const schedule = await getDoctorSchedule();

  return (
    <DoctorSchedulePage
      initialSchedule={schedule ?? { availableDays: [], availableSlots: [] }}
      doctorId={doctorId}
    />
  );
}
