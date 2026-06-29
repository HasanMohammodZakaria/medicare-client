export const dynamic = "force-dynamic";
import { getAdminAppointments } from "@/app/lib/actions/admin.action";
import ManageAppointments from "@/components/admin/ManageAppointments";

export const metadata = { title: "Manage Appointments | MediNexa" };

export default async function ManageAppointmentsPage() {
  const appointments = await getAdminAppointments().catch(() => []);
  return <ManageAppointments initialAppointments={appointments} />;
}
