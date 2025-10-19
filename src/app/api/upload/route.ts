export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Resume from '@/models/Resume';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Buffer } from 'buffer';

interface FileLike {
  arrayBuffer: () => Promise<ArrayBuffer>;
  size?: number;
  type?: string;
  name?: string;
}

interface ParsedResumeData {
  email: string;
  phone: string;
  skills: string[];
  rawText: string;
}

function isFileLike(x: unknown): x is FileLike {
  return !!x && typeof (x as any).arrayBuffer === 'function';
}

async function parseWithPdfParse(buffer: Buffer | Uint8Array): Promise<{ text: string }> {
  // dynamic import (silence TS module resolution)
  // @ts-ignore
  const mod: any = await import('pdf-parse').catch((e: unknown) => {
    throw new Error(`pdf-parse import error: ${(e as any)?.message ?? String(e)}`);
  });

  // try common export shapes
  const candidates: any[] = [
    mod,
    mod?.default,
    mod?.PDFParse,
    mod?.PDFParser,
    mod?.PDFParse?.default,
    mod?.PDFParser?.default
  ].filter(Boolean);

  let lastErr: unknown = null;
  for (const cand of candidates) {
    try {
      // if candidate is a function that accepts buffer, call it
      if (typeof cand === 'function') {
        // attempt direct call
        try {
          const res = await cand(buffer);
          if (res && typeof res === 'object' && typeof res.text === 'string') {
            return { text: res.text };
          }
        } catch (e) {
          // maybe it's a constructor
        }

        // attempt as constructor + .parse() or promise
        try {
          const inst = new (cand as any)(buffer);
          if (inst && typeof inst.parse === 'function') {
            const parsed = await inst.parse();
            if (parsed && typeof parsed.text === 'string') return { text: parsed.text };
          }
          // constructor might return a promise-like
          if (inst && typeof inst.then === 'function') {
            const awaited = await inst;
            if (awaited && typeof awaited.text === 'string') return { text: awaited.text };
          }
        } catch (e) {
          lastErr = e;
        }
      }
    } catch (e) {
      lastErr = e;
    }
  }

  console.error('pdf-parse keys:', Object.keys(mod || {}));
  throw new Error(`pdf-parse shape not supported. last error: ${(lastErr as any)?.message ?? String(lastErr)}`);
}

async function parsePdfBuffer(buffer: Buffer | Uint8Array): Promise<{ text: string }> {
  return await parseWithPdfParse(buffer);
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const fileEntry = formData.get('file');

    if (!isFileLike(fileEntry)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const file = fileEntry;
    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    }

    if (file.type && !/pdf/i.test(file.type)) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let data: { text: string };
    try {
      data = await parsePdfBuffer(buffer);
    } catch (err) {
      console.error('PDF parsing failed (final):', err);
      return NextResponse.json(
        { error: 'Failed to parse PDF file. Check server logs for details.' },
        { status: 500 }
      );
    }

    const text: string = data?.text ?? '';

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i);
    const email = emailMatch ? emailMatch[0] : '';

    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    const skillsLine = text.split('\n').find(line => /(skills?|technologies?|frameworks?|languages?)/i.test(line));
    const skills = (skillsLine
      ? skillsLine.split(/[:,•\-]/).slice(1).join(' ')
      : text
          .split('\n')
          .filter(line => /(skills?|technologies?|frameworks?|languages?)/i.test(line))
          .join(' '))
      .split(/[,;•\-]/)
      .map(s => s.trim())
      .filter(Boolean);

    const parsedData: ParsedResumeData = {
      email,
      phone,
      skills: skills.slice(0, 10),
      rawText: text.slice(0, 2000)
    };

    const sessUser = session.user as any;
    const userId = sessUser?.id ?? sessUser?.sub ?? sessUser?.email ?? 'unknown';

    await Resume.create({ userId, parsedData });

    return NextResponse.json(
      { success: true, parsedData, message: 'Resume processed successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Resume upload/parse error:', error);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}