import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { defaultPortfolioDesign, normalizePortfolioDesign, PortfolioDesign } from '@/lib/portfolioDesign';

const colors = ['#6d5dfc', '#0f766e', '#db2777', '#ea580c', '#2563eb', '#111827'];

function fallbackDesign(headline: string, brief: string) {
  const seed = `${headline} ${brief}`.toLowerCase();
  const accent = seed.includes('creative') || seed.includes('designer') ? '#db2777' : seed.includes('developer') || seed.includes('tech') ? '#2563eb' : seed.includes('minimal') ? '#111827' : '#6d5dfc';
  return { ...defaultPortfolioDesign, accent, hero: seed.includes('minimal') ? 'minimal' as const : seed.includes('photo') ? 'split' as const : 'centered' as const };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brief = '', headline = '' } = await request.json();
  const fallback = fallbackDesign(headline, brief);
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ design: fallback, generatedBy: 'starter' });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `You are a portfolio art director. Return JSON only with accent, background, surface, text, mutedText (hex colors), font (sans|serif|mono), hero (centered|split|minimal), radius (soft|rounded|sharp), and sectionOrder. Make an accessible, restrained portfolio design. Allowed accent choices: ${colors.join(', ')}. sectionOrder may only use about, skills, experience, projects, education.` },
          { role: 'user', content: `Professional headline: ${headline}. Design brief: ${String(brief).slice(0, 500)}` },
        ],
      }),
    });
    if (!response.ok) throw new Error('AI request failed');
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    return NextResponse.json({ design: normalizePortfolioDesign(JSON.parse(content) as Partial<PortfolioDesign>), generatedBy: 'ai' });
  } catch {
    return NextResponse.json({ design: fallback, generatedBy: 'starter' });
  }
}
