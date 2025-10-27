import Portfolio from '@/models/Portfolio';
import { connectDB } from '@/lib/db';
import '@/styles/themes.css'; 

export default async function PublicPortfolioPage({ params }: { params: { userId: string } }) {
  await connectDB();
  const portfolio = await Portfolio.findOne({ userId: params.userId });

  if (!portfolio) {
    return <div>Profile not found</div>;
  }

  return (
    <div className={portfolio.theme}>
      <h1>{portfolio.summary || 'No Data'}</h1>
      <p>Skills: {(portfolio.skills ?? []).join(', ')}</p>
    </div>
  );
}
