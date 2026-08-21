import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { normalizePortfolioDesign, PortfolioDesign } from '@/lib/portfolioDesign';
import { getGroqModel } from '@/lib/groq';

type Input = Record<string, unknown>;

const text = (value: unknown, max = 2000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const list = (value: unknown) => Array.isArray(value) ? value : [];

function portfolioFrom(value: Input) {
  return {
    name: text(value.name, 120), email: text(value.email, 254), phone: text(value.phone, 80),
    headline: text(value.headline, 180), summary: text(value.summary, 700),
    skills: list(value.skills).map((item) => text(item, 80)).filter(Boolean).slice(0, 30),
    experience: list(value.experience).map((item) => {
      const entry = item as Input;
      return { company: text(entry.company, 150), position: text(entry.position, 150), startDate: text(entry.startDate, 60), endDate: text(entry.endDate, 60), description: text(entry.description, 800) };
    }).filter((item) => item.company || item.position || item.description).slice(0, 12),
    education: list(value.education).map((item) => {
      const entry = item as Input;
      return { institution: text(entry.institution, 180), degree: text(entry.degree, 180), startYear: text(entry.startYear, 20), endYear: text(entry.endYear, 20) };
    }).filter((item) => item.institution || item.degree).slice(0, 8),
    projects: list(value.projects).map((item) => {
      const entry = item as Input;
      return { name: text(entry.name, 150), description: text(entry.description, 800), link: text(entry.link, 500) };
    }).filter((item) => item.name || item.description).slice(0, 12),
  };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Groq is not configured. Add GROQ_API_KEY to your server environment.' }, { status: 503 });

  let input: Input;
  try { input = await request.json() as Input; } catch { return NextResponse.json({ error: 'Invalid portfolio request.' }, { status: 400 }); }
  const brief = text(input.brief, 800);
  const current = portfolioFrom((input.portfolio as Input) ?? {});
  if (!brief && !Object.values(current).some((value) => Array.isArray(value) ? value.length : value)) return NextResponse.json({ error: 'Add a short brief or some portfolio details first.' }, { status: 400 });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: getGroqModel(), temperature: 0.45, response_format: { type: 'json_object' }, messages: [
        { role: 'system', content: 'You are a careful portfolio writer and art director. Return JSON only with keys portfolio and design. portfolio has exactly name, email, phone, headline, summary, skills, experience, education, projects. Preserve supplied factual details; never invent employers, dates, credentials, project links, or metrics. Improve wording only. You may leave unknown values empty. design has accent, background, surface, text, mutedText (hex colors), font (sans|serif|mono), hero (centered|split|minimal), radius (soft|rounded|sharp), and sectionOrder using only about, skills, experience, projects, education.' },
        { role: 'user', content: JSON.stringify({ brief, currentPortfolio: current }) },
      ] }),
    });
    if (!response.ok) return NextResponse.json({ error: `Groq could not generate the portfolio (${response.status}). ${(await response.text()).slice(0, 400)}` }, { status: 502 });
    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') throw new Error('Groq returned an empty response.');
    const generated = JSON.parse(content) as { portfolio?: Input; design?: Partial<PortfolioDesign> };
    return NextResponse.json({ portfolio: portfolioFrom(generated.portfolio ?? {}), design: normalizePortfolioDesign(generated.design) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? `Groq generation failed: ${error.message}` : 'Groq generation failed.' }, { status: 502 });
  }
}
