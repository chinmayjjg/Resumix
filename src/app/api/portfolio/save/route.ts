import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';
import { transformResumeData } from '@/lib/transformResumeData';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawData = await req.json();
    const structured = transformResumeData(rawData);

    await connectDB();

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { userId },
      { userId, ...structured },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      portfolio: updatedPortfolio,
    });
  } catch (err) {
    console.error('Error saving portfolio:', err);
    return NextResponse.json(
      { error: 'Failed to save portfolio' },
      { status: 500 }
    );
  }
}
