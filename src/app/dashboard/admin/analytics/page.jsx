import { getAdminAnalytics } from "@/app/lib/actions/admin.action";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

export const metadata = { title: "Analytics | MediNexa" };

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalytics().catch(() => null);
  return <AdminAnalytics data={data ?? {}} />;
}
