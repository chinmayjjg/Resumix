'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { defaultPortfolioDesign, normalizePortfolioDesign, PortfolioDesign, PortfolioSection } from '@/lib/portfolioDesign';

const sectionLabels: Record<PortfolioSection, string> = { about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects', education: 'Education' };

export default function DesignStudio({ design, headline, onChange }: { design?: Partial<PortfolioDesign>; headline: string; onChange: (design: PortfolioDesign) => void }) {
  const current = normalizePortfolioDesign(design);
  const [brief, setBrief] = useState('');
  const [generating, setGenerating] = useState(false);

  const update = <K extends keyof PortfolioDesign>(key: K, value: PortfolioDesign[K]) => onChange({ ...current, [key]: value });
  const move = (index: number, direction: -1 | 1) => {
    const next = [...current.sectionOrder];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update('sectionOrder', next);
  };
  const generate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/portfolio/design', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brief, headline }) });
      const result = await response.json();
      if (result.design) onChange(normalizePortfolioDesign(result.design));
    } finally { setGenerating(false); }
  };
  return <div className="space-y-7">
    <div className="rounded-xl border border-violet-100 bg-violet-50 p-4"><div className="flex gap-2 text-sm font-semibold text-violet-900"><Sparkles className="mt-0.5 h-4 w-4" />AI starting point</div><p className="mt-1 text-sm text-violet-800">Describe the feeling you want; you can adjust every choice afterwards.</p><div className="mt-3 flex gap-2"><input value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="e.g. confident, editorial, warm" className="min-w-0 flex-1 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm" /><button disabled={generating} onClick={generate} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{generating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}</button></div></div>
    <div><p className="mb-3 text-sm font-semibold">Color system</p><div className="grid grid-cols-2 gap-3">{(['accent', 'background', 'surface', 'text'] as const).map((field) => <label key={field} className="rounded-lg border p-2 text-xs capitalize text-slate-600">{field}<input type="color" value={current[field]} onChange={(e) => update(field, e.target.value)} className="mt-1 block h-8 w-full cursor-pointer" /></label>)}</div></div>
    <div className="grid grid-cols-2 gap-3"><Select label="Type" value={current.font} options={['sans', 'serif', 'mono']} onChange={(value) => update('font', value as PortfolioDesign['font'])} /><Select label="Hero" value={current.hero} options={['centered', 'split', 'minimal']} onChange={(value) => update('hero', value as PortfolioDesign['hero'])} /><Select label="Corners" value={current.radius} options={['soft', 'rounded', 'sharp']} onChange={(value) => update('radius', value as PortfolioDesign['radius'])} /></div>
    <div><div className="mb-2 flex items-center justify-between"><p className="text-sm font-semibold">Section order</p><button onClick={() => onChange(defaultPortfolioDesign)} className="text-xs font-medium text-violet-700">Reset</button></div><div className="space-y-1">{current.sectionOrder.map((section, index) => <div key={section} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"><span>{sectionLabels[section]}</span><span className="flex gap-2"><button onClick={() => move(index, -1)} disabled={index === 0} className="disabled:opacity-30">↑</button><button onClick={() => move(index, 1)} disabled={index === current.sectionOrder.length - 1} className="disabled:opacity-30">↓</button></span></div>)}</div></div>
  </div>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="text-xs font-medium text-slate-600">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 block w-full rounded-lg border bg-white p-2 text-sm capitalize">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
