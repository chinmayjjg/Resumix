import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    await connectDB();

    // Prevent overwriting userId or other immutable fields if they are passed in body
    const { _id, userId: _, createdAt, updatedAt, ...updateData } = data;

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { userId },
      {
        $set: {
          ...updateData,
          userId // Ensure userId is always set/preserved
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      portfolio: updatedPortfolio,
    });
  } catch (err) {
    console.error('Error saving portfolio:', err);
    return NextResponse.json(
      { error: 'Failed to save portfolio', details: String(err) },
      { status: 500 }
    );
  }
}
