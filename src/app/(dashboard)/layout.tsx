import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-50 dark:bg-[#090d1a]">
      <Sidebar />
      <div className="relative flex-1 overflow-y-auto">
        <div className="relative min-h-full p-5 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
