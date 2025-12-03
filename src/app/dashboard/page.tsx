import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>You are not logged in</div>;
  }

  await connectDB();
  const portfolio = await Portfolio.findOne({ userId: session.user.id }).lean() as any;

  return <DashboardClient portfolio={portfolio} session={session} />;
}
