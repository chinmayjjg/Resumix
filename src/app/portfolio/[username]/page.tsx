import { notFound } from 'next/navigation';

export const revalidate = 0;

async function getPortfolio(username: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/portfolio/${username}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-1">{portfolio.name}</h1>
        <p className="text-gray-600 mb-6">{portfolio.headline}</p>

        <PortfolioLayout portfolio={portfolio} />
      </div>
    </div>
  );
}

import PortfolioLayout from '@/components/portfolio/PortfolioLayout';
