export const dynamic = "force-dynamic";
import { getPatientProfile } from "@/app/lib/actions/patient.action";
import MyProfile from "@/components/patient/patientProfile";

export const metadata = { title: "My Profile | MediNexa" };

export default async function ProfilePage() {
  const profile = await getPatientProfile();

  return <MyProfile initialProfile={profile ?? {}} />;
}
