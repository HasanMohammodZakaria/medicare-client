export const dynamic = "force-dynamic";
import { getPatientPayments } from "@/app/lib/actions/patient.action";
import PatientPaymentHistory from "@/components/patient/PatientPaymentHistory";

export default async function PaymentHistoryPage() {
  const payments = await getPatientPayments();

  return <PatientPaymentHistory initialPayments={payments ?? []} />;
}
