import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import ThemeToggle from "@/components/ThemeToggle";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>You are not logged in</div>;
  }

  await connectDB();
  const portfolio = await Portfolio.findOne({ userId: session.user.id }).lean();

  const theme = portfolio?.theme || "light";

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <ThemeToggle currentTheme={theme} userId={session.user.id} />
        </header>

        <section className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">Current Theme:</h2>
            <p>{theme}</p>
          </div>

          {!portfolio && <p>No portfolio data yet… create one!</p>}

          {portfolio && (
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold">Portfolio Preview</h2>
              <p><strong>About:</strong> {portfolio.about || "N/A"}</p>
              <p><strong>Skills:</strong> {portfolio.skills?.join(", ") || "N/A"}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
