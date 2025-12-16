import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';
import PortfolioLayout from '@/components/portfolio/PortfolioLayout';

export const revalidate = 0;

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPortfolio = await Portfolio.findOne({ userId: username }).lean();

    if (!rawPortfolio) return notFound();

    // Ensure serializability effectively
    const portfolio = JSON.parse(JSON.stringify(rawPortfolio));

    return (
      <>
        <PortfolioLayout portfolio={portfolio} />
      </>
    );
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    // In case of DB error, we might want to show notFound or throw generic error
    // For now, allow Next.js error boundary to handle if it crashes, or return notFound if essentially missing
    throw error;
  }
}
