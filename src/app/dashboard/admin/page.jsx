import {
  getAdminOverview,
  getAdminAnalytics,
} from "@/app/lib/actions/admin.action";
import AdminOverview from "@/components/admin/AdminOverview";

export default async function AdminOverviewPage() {
  const [overview, analytics] = await Promise.all([
    getAdminOverview(),
    getAdminAnalytics(),
  ]);

  return <AdminOverview overview={overview} analytics={analytics} />;
}
