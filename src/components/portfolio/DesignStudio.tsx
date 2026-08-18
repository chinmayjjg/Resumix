'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { defaultPortfolioDesign, normalizePortfolioDesign, PortfolioDesign, PortfolioSection } from '@/lib/portfolioDesign';

const sectionLabels: Record<PortfolioSection, string> = { about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects', education: 'Education' };
const palettes = [
  { name: 'Indigo', accent: '#635bff', background: '#f7f7fb', surface: '#ffffff', text: '#17172a' },
  { name: 'Studio', accent: '#e6483d', background: '#fff8f4', surface: '#ffffff', text: '#28211f' },
  { name: 'Forest', accent: '#16816a', background: '#f3faf7', surface: '#ffffff', text: '#142821' },
  { name: 'Ink', accent: '#171717', background: '#f5f5f4', surface: '#ffffff', text: '#18181b' },
];

export default function DesignStudio({ design, headline, name, onChange }: { design?: Partial<PortfolioDesign>; headline: string; name: string; onChange: (design: PortfolioDesign) => void }) {
  const current = normalizePortfolioDesign(design);
  const [brief, setBrief] = useState('');
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const update = <K extends keyof PortfolioDesign>(key: K, value: PortfolioDesign[K]) => onChange({ ...current, [key]: value });
  const applyPalette = (palette: typeof palettes[number]) => onChange({ ...current, ...palette });
  const move = (index: number, direction: -1 | 1) => { const order = [...current.sectionOrder]; const target = index + direction; if (target < 0 || target >= order.length) return; [order[index], order[target]] = [order[target], order[index]]; update('sectionOrder', order); };
  const generate = async () => {
    setGenerating(true); setMessage('');
    try {
      const response = await fetch('/api/portfolio/design', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brief: brief || 'Create a polished portfolio that feels personal and confident.', headline }) });
      const result = await response.json();
      if (!response.ok || !result.design) throw new Error(result.error || 'Could not create a design');
      onChange(normalizePortfolioDesign(result.design));
      setMessage(result.generatedBy === 'ai' ? 'AI direction applied — now tune it on the canvas.' : 'A tailored starter direction was applied.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not create a design. Please try again.'); }
    finally { setGenerating(false); }
  };
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-[#f6f7fb] p-3 sm:p-5">
      <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-900">Live canvas</p><p className="text-xs text-slate-500">Your changes appear instantly.</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">Portfolio page</span></div>
      <CanvasPreview design={current} name={name} headline={headline} />
    </div>
    <aside className="space-y-5 lg:max-h-[65vh] lg:overflow-y-auto lg:pr-1">
      <section className="rounded-2xl bg-slate-950 p-4 text-white shadow-xl shadow-slate-900/15"><div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-violet-300" />Describe your vibe</div><textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="A bold editorial portfolio for a product designer, warm colors, lots of whitespace…" rows={3} className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-violet-400" /><button type="button" onClick={generate} disabled={generating} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-violet-100 disabled:opacity-60">{generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}{generating ? 'Creating direction…' : 'Generate a direction'}</button>{message && <p className="mt-2 text-xs text-violet-200">{message}</p>}</section>
      <section><Label>Color direction</Label><div className="grid grid-cols-2 gap-2">{palettes.map((palette) => <button key={palette.name} type="button" onClick={() => applyPalette(palette)} className="group rounded-xl border border-slate-200 bg-white p-2 text-left hover:border-slate-400"><div className="flex h-8 overflow-hidden rounded-lg">{[palette.accent, palette.background, palette.text].map((color) => <span key={color} className="flex-1" style={{ background: color }} />)}</div><span className="mt-1.5 block text-xs font-medium text-slate-600">{palette.name}</span></button>)}</div><div className="mt-2 grid grid-cols-2 gap-2">{(['accent', 'background', 'surface', 'text'] as const).map((field) => <label key={field} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs capitalize text-slate-600"><input aria-label={field} type="color" value={current[field]} onChange={(e) => update(field, e.target.value)} className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" />{field}</label>)}</div></section>
      <section className="grid grid-cols-3 gap-2"><Choice label="Type" value={current.font} options={['sans', 'serif', 'mono']} onChange={(value) => update('font', value as PortfolioDesign['font'])} /><Choice label="Hero" value={current.hero} options={['centered', 'split', 'minimal']} onChange={(value) => update('hero', value as PortfolioDesign['hero'])} /><Choice label="Edges" value={current.radius} options={['soft', 'rounded', 'sharp']} onChange={(value) => update('radius', value as PortfolioDesign['radius'])} /></section>
      <section><div className="flex items-center justify-between"><Label>Page flow</Label><button type="button" onClick={() => onChange(defaultPortfolioDesign)} className="text-xs font-semibold text-violet-700">Reset</button></div><div className="mt-2 space-y-1">{current.sectionOrder.map((section, index) => <div key={section} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><span>{sectionLabels[section]}</span><span className="flex gap-2 text-slate-500"><button type="button" aria-label={`Move ${section} up`} onClick={() => move(index, -1)} disabled={!index} className="disabled:opacity-25">↑</button><button type="button" aria-label={`Move ${section} down`} onClick={() => move(index, 1)} disabled={index === current.sectionOrder.length - 1} className="disabled:opacity-25">↓</button></span></div>)}</div></section>
    </aside>
  </div>;
}

function CanvasPreview({ design, name, headline }: { design: PortfolioDesign; name: string; headline: string }) { const rounded = design.radius === 'soft' ? 'rounded-[24px]' : design.radius === 'sharp' ? 'rounded-none' : 'rounded-xl'; const centered = design.hero === 'centered'; return <div className={`min-h-[370px] overflow-hidden border border-slate-200 shadow-2xl ${rounded}`} style={{ background: design.background, color: design.text }}><div className="flex h-10 items-center justify-between border-b px-4 text-[9px]" style={{ borderColor: `${design.mutedText}30` }}><span className="font-bold" style={{ color: design.accent }}>✦ PORTFOLIO</span><span className="opacity-60">Work&nbsp;&nbsp; About&nbsp;&nbsp; Contact</span></div><div className={`px-6 py-10 ${centered ? 'text-center' : ''}`}><div className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: design.accent }}>Hello, I&apos;m</div><h3 className={`mt-2 text-3xl font-bold tracking-tight ${design.font === 'serif' ? 'font-serif' : design.font === 'mono' ? 'font-mono' : ''}`}>{name || 'Your Name'}</h3><p className={`mt-3 text-sm leading-6 ${centered ? 'mx-auto max-w-xs' : 'max-w-sm'}`} style={{ color: design.mutedText }}>{headline || 'A clear, confident introduction to your work and the value you create.'}</p><button className="mt-5 px-4 py-2 text-xs font-bold text-white" style={{ background: design.accent, borderRadius: design.radius === 'sharp' ? 0 : 999 }}>Let&apos;s work together</button></div><div className="mx-5 grid grid-cols-2 gap-3 pb-6"><div className={`h-20 p-3 ${rounded}`} style={{ background: design.surface }}><span className="text-[9px] font-bold uppercase" style={{ color: design.accent }}>Selected work</span><div className="mt-3 h-1.5 w-3/4 rounded-full" style={{ background: `${design.mutedText}35` }} /></div><div className={`h-20 p-3 ${rounded}`} style={{ background: design.surface }}><span className="text-[9px] font-bold uppercase" style={{ color: design.accent }}>Experience</span><div className="mt-3 h-1.5 w-1/2 rounded-full" style={{ background: `${design.mutedText}35` }} /></div></div></div>; }
function Label({ children }: { children: ReactNode }) { return <p className="text-sm font-semibold text-slate-900">{children}</p>; }
function Choice({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="text-[11px] font-medium text-slate-500">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 text-xs capitalize text-slate-800">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
