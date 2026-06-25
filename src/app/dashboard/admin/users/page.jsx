import { getAdminUsers } from "@/app/lib/actions/admin.action";
import ManageUsers from "@/components/admin/ManageUsers";

export const metadata = { title: "Manage Users | MediNexa" };

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  return <ManageUsers initialUsers={users ?? []} />;
}
