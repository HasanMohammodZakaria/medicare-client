import { getAdminPayments } from "@/app/lib/actions/admin.action";
import AdminPayments from "@/components/admin/AdminPayments";

export const metadata = { title: "Payment Management | MediNexa" };

export default async function AdminPaymentsPage() {
  const payments = await getAdminPayments().catch(() => []);
  return <AdminPayments initialPayments={payments} />;
}
