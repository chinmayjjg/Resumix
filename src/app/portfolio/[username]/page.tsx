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
    <>
      <PortfolioLayout portfolio={portfolio} />
    </>
  );
}


import PortfolioLayout from '@/components/portfolio/PortfolioLayout';
