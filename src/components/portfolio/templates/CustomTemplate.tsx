import Image from 'next/image';
import type { ReactNode } from 'react';
import { IPortfolio } from '@/models/Portfolio';
import { normalizePortfolioDesign, PortfolioSection } from '@/lib/portfolioDesign';

export default function CustomTemplate({ portfolio }: { portfolio: IPortfolio }) {
  const design = normalizePortfolioDesign(portfolio.design);
  const font = design.font === 'serif' ? 'font-serif' : design.font === 'mono' ? 'font-mono' : 'font-sans';
  const radius = design.radius === 'soft' ? 'rounded-[2rem]' : design.radius === 'sharp' ? 'rounded-none' : 'rounded-2xl';
  const sections: Record<PortfolioSection, ReactNode> = {
    about: portfolio.summary ? <Section title="About" design={design} radius={radius}><p className="text-lg leading-8">{portfolio.summary}</p></Section> : null,
    skills: portfolio.skills?.length ? <Section title="Skills" design={design} radius={radius}><div className="flex flex-wrap gap-2">{portfolio.skills.map((skill) => <span key={skill} className="px-3 py-1.5 text-sm font-medium" style={{ color: design.accent, backgroundColor: `${design.accent}18`, borderRadius: design.radius === 'sharp' ? 0 : 999 }}>{skill}</span>)}</div></Section> : null,
    experience: portfolio.experience?.length ? <Section title="Experience" design={design} radius={radius}><div className="space-y-6">{portfolio.experience.map((item, index) => <article key={`${item.company}-${index}`} className="border-l-2 pl-5" style={{ borderColor: design.accent }}><div className="flex flex-wrap justify-between gap-2"><h3 className="font-bold text-xl">{item.position}</h3><span style={{ color: design.mutedText }}>{item.startDate} — {item.endDate}</span></div><p className="font-medium mt-1" style={{ color: design.accent }}>{item.company}</p><p className="mt-3 leading-7" style={{ color: design.mutedText }}>{item.description}</p></article>)}</div></Section> : null,
    projects: portfolio.projects?.length ? <Section title="Selected work" design={design} radius={radius}><div className="grid gap-4 md:grid-cols-2">{portfolio.projects.map((item, index) => <article key={`${item.name}-${index}`} className="p-5 border" style={{ borderColor: `${design.mutedText}35`, borderRadius: design.radius === 'sharp' ? 0 : 16 }}><h3 className="font-bold text-xl">{item.name}</h3><p className="mt-2 leading-7" style={{ color: design.mutedText }}>{item.description}</p>{item.link && <a className="inline-block mt-4 font-semibold" href={item.link} style={{ color: design.accent }}>View project ↗</a>}</article>)}</div></Section> : null,
    education: portfolio.education?.length ? <Section title="Education" design={design} radius={radius}><div className="space-y-4">{portfolio.education.map((item, index) => <div key={`${item.institution}-${index}`}><div className="flex flex-wrap justify-between gap-2"><h3 className="font-bold">{item.degree}</h3><span style={{ color: design.mutedText }}>{item.startYear} — {item.endYear}</span></div><p style={{ color: design.mutedText }}>{item.institution}</p></div>)}</div></Section> : null,
  };

  return <div className={`min-h-screen ${font}`} style={{ background: design.background, color: design.text }}>
    <header className={`mx-auto max-w-6xl px-6 py-20 md:py-28 ${design.hero === 'split' ? 'md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-16' : design.hero === 'centered' ? 'text-center' : ''}`}>
      <div className={design.hero === 'split' ? '' : 'mx-auto max-w-3xl'}>
        <p className="font-semibold tracking-[0.2em] uppercase text-sm" style={{ color: design.accent }}>Portfolio</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">{portfolio.name || 'Your Name'}</h1>
        {portfolio.headline && <p className="mt-5 text-xl md:text-2xl" style={{ color: design.mutedText }}>{portfolio.headline}</p>}
        <div className={`mt-8 flex flex-wrap gap-3 ${design.hero === 'centered' ? 'justify-center' : ''}`}>{portfolio.email && <a href={`mailto:${portfolio.email}`} className="px-5 py-3 font-semibold text-white" style={{ backgroundColor: design.accent, borderRadius: design.radius === 'sharp' ? 0 : 999 }}>Let&apos;s talk</a>}{portfolio.phone && <span className="px-5 py-3 border" style={{ borderColor: `${design.mutedText}40`, borderRadius: design.radius === 'sharp' ? 0 : 999 }}>{portfolio.phone}</span>}</div>
      </div>
      {portfolio.userImage && design.hero === 'split' && <Image src={portfolio.userImage} alt={portfolio.name} width={220} height={220} className={`mt-10 aspect-square object-cover md:mt-0 ${radius}`} unoptimized />}
    </header>
    <main className="mx-auto max-w-6xl space-y-8 px-6 pb-24">{design.sectionOrder.map((section) => <div key={section}>{sections[section]}</div>)}</main>
  </div>;
}

function Section({ title, design, radius, children }: { title: string; design: ReturnType<typeof normalizePortfolioDesign>; radius: string; children: ReactNode }) {
  return <section className={`p-7 md:p-9 ${radius}`} style={{ background: design.surface }}><h2 className="mb-6 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: design.accent }}>{title}</h2>{children}</section>;
}
