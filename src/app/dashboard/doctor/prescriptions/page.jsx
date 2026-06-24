import {
  getDoctorPrescriptions,
  getCompletedAppointmentsForPrescription,
} from "@/app/lib/actions/doctor.action";
import DoctorPrescriptions from "@/components/doctor/DoctorPrescriptions";

export const metadata = { title: "Prescription Management | MediNexa" };

export default async function PrescriptionPage() {
  const [prescriptions, completedAppointments] = await Promise.all([
    getDoctorPrescriptions(),
    getCompletedAppointmentsForPrescription(),
  ]);

  return (
    <DoctorPrescriptions
      initialPrescriptions={prescriptions ?? []}
      completedAppointments={completedAppointments ?? []}
    />
  );
}
