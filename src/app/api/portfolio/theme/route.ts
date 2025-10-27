import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { theme } = await req.json();
    if (!['light', 'dark'].includes(theme))
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });

    await connectDB();
    await Portfolio.findOneAndUpdate(
      { userId: session.user.id },
      { theme },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
