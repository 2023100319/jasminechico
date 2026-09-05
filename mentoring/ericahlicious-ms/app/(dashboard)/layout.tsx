import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Role } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const role = (session.user as { role?: Role }).role;
  const name = session.user.name ?? "User";

  if (!role) redirect("/");

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role={role} userName={name} />
      <main className="pl-60 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
