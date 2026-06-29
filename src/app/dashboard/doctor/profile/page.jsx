export const dynamic = "force-dynamic";
import { getDoctorProfile } from "@/app/lib/actions/doctor.action";
import DoctorProfile from "@/components/doctor/DoctorProfile";

export const metadata = { title: "My Profile | MediNexa" };

export default async function DoctorProfilePage() {
  const profile = await getDoctorProfile().catch(() => null);

  return <DoctorProfile initialProfile={profile ?? {}} />;
}
