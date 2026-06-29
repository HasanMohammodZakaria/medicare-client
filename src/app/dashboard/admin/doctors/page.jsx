export const dynamic = "force-dynamic";
import { getDoctors } from "@/app/lib/actions/admin.action";
import ManageDoctors from "@/components/admin/ManageDoctor";

export const metadata = {
  title: "Manage Doctors | Admin Dashboard",
};

export default async function ManageDoctorsPage() {
  let doctors = [];
  try {
    doctors = await getDoctors();
  } catch (err) {
    console.error("Failed to load doctors:", err);
  }

  return <ManageDoctors initialDoctors={doctors} />;
}
