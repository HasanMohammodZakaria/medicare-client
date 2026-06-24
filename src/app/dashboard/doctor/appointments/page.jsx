import { getDoctorAppointments } from "@/app/lib/actions/doctor.action";
import DoctorAppointments from "@/components/doctor/DoctorAppointments";

export const metadata = { title: "Appointment Requests | MediNexa" };

export default async function AppointmentsPage({ doctorId }) {
  const appointments = await getDoctorAppointments();

  return (
    <DoctorAppointments
      initialAppointments={appointments ?? []}
      doctorId={doctorId}
    />
  );
}
