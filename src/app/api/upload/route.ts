import { NextResponse } from 'next/server';
import * as pdf from 'pdf-parse';
import Resume from '@/models/Resume';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Buffer } from 'buffer';

type FileLike = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  size?: number;
  type?: string;
  name?: string;
};

function isFileLike(x: unknown): x is FileLike {
  return !!x && typeof (x as any).arrayBuffer === 'function';
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const formData = await req.formData();
    const fileEntry = formData.get('file');

    if (!isFileLike(fileEntry))
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const file = fileEntry;
    if (file.size === 0) return NextResponse.json({ error: 'Empty file' }, { status: 400 });

    if (file.type && file.type !== 'application/pdf')
      return NextResponse.json({ error: 'Only PDF allowed' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await (pdf as any)(buffer);
    const text: string = data?.text ?? '';

    // simple regex parsing
    const email = (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i) || [])[0] || '';
    const phone = (text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?){1,2}\d{3,4}/) || [])[0] || '';

    // find a line that mentions skills and extract following items
    const skillsLine = text.split('\n').find(line => /(^|\b)(skills?|technical skills|expertise)(\b|:)/i);

    const skills = (skillsLine
      ? skillsLine.split(/[:,•\-]/).slice(1).join(' ')
      : text
          .split('\n')
          .filter(line => /skills?/i.test(line))
          .join(' '))
      .split(/[,;•\-]/)
      .map(s => s.trim())
      .filter(Boolean);

    const parsedData = { email, phone, skills, rawText: text };

    const sessUser: any = (session as any).user ?? {};
    const userId = sessUser.id ?? sessUser.sub ?? sessUser.email ?? 'unknown';

    await Resume.create({ userId, parsedData });

    return NextResponse.json({ success: true, parsedData }, { status: 201 });
  } catch (error) {
    console.error('Resume upload/parse error:', error);
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 });
  }
}
