// app/dashboard/patient/appointments/page.jsx
// SERVER COMPONENT

import { getPatientAppointments } from "@/app/lib/actions/patient.action";
import PatientAppointments from "@/components/patient/PatientAppointments";

export const metadata = { title: "My Appointments | MediNexa" };

export default async function PatientAppointmentsPage() {
  const appointments = await getPatientAppointments();

  return <PatientAppointments initialAppointments={appointments ?? []} />;
}
