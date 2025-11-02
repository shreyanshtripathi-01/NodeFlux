import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar userEmail={user.email ?? ""} userName={user.user_metadata?.name} />
      <main className="flex-1 ml-[240px]">
        {children}
      </main>
    </div>
  );
}