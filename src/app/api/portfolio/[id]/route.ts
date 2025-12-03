import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        // Try to find by Portfolio _id first, then by userId
        let portfolio = await Portfolio.findById(id).lean();

        if (!portfolio) {
            portfolio = await Portfolio.findOne({ userId: id }).lean();
        }

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        return NextResponse.json(portfolio);
    } catch (err) {
        console.error('Error fetching portfolio:', err);
        return NextResponse.json(
            { error: 'Failed to fetch portfolio' },
            { status: 500 }
        );
    }
}
