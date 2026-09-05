import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const portfolio = await Portfolio.findOne({ userId: session.user.id }).lean() as any;
  // Mongoose values (including nested _id fields) cannot cross the Server-to-Client boundary.
  const plainPortfolio = portfolio ? JSON.parse(JSON.stringify(portfolio)) : null;

  return <DashboardClient portfolio={plainPortfolio} session={session} />;
}
