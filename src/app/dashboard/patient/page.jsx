import {
  getPatientAppointments,
  getPatientFavoriteDoctors,
  getPatientOverview,
} from "@/app/lib/actions/patient.action";
import PatientOverview from "@/components/patient/PatientOverview";

export const metadata = {
  title: "Patient Dashboard | MediCare Connect",
};

export default async function PatientOverviewPage() {
  const [overviewResult, appointmentsResult, favDoctorsResult] =
    await Promise.allSettled([
      getPatientOverview(),
      getPatientAppointments(),
      getPatientFavoriteDoctors(),
    ]);

  const overview =
    overviewResult.status === "fulfilled" ? overviewResult.value : null;

  const allAppointments =
    appointmentsResult.status === "fulfilled"
      ? appointmentsResult.value || []
      : [];

  const favDoctors =
    favDoctorsResult.status === "fulfilled" ? favDoctorsResult.value || [] : [];

  const upcomingAppointments = allAppointments
    .filter(
      (a) =>
        a.appointmentStatus === "pending" || a.appointmentStatus === "accepted",
    )
    .slice(0, 5);

  return (
    <PatientOverview
      overview={overview}
      upcomingAppointments={upcomingAppointments}
      favDoctors={favDoctors.slice(0, 4)}
    />
  );
}
