import { UserDetail } from "@/components/admin/user-detail";

export default async function AdminUserDetailPage({ params }: PageProps<"/admin/users/[id]">) {
  const { id: rawId } = await params;

  return <UserDetail id={Number(rawId)} />;
}
