import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const portfolio = await Portfolio.findOne({ userId: session.user.id });

    return NextResponse.json({ portfolio });
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}
