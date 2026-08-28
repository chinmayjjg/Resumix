import Link from "next/link";
import { ArrowRight, FileText, Globe2, Sparkles, Wand2 } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AuroraBackground from "@/components/ui/AuroraBackground";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const features = [
  [FileText, "Drop in your resume", "Your PDF becomes a structured starting point in seconds."],
  [Wand2, "Make it unmistakably yours", "Edit every detail and choose a visual direction that feels like you."],
  [Globe2, "Share one beautiful link", "Publish a fast, responsive portfolio designed to open doors."],
];

export default async function Home() {
  if (await getServerSession(authOptions)) redirect("/dashboard");

  return <div className="relative overflow-hidden bg-[#070b18]">
    <AuroraBackground />
    <main className="relative mx-auto max-w-7xl px-6 pt-36">
      <section className="grid min-h-[680px] items-center gap-14 py-16 lg:grid-cols-[1.1fr_.9fr]">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200"><Sparkles className="h-3.5 w-3.5" /> AI-powered portfolio builder</div>
          <h1 className="text-5xl font-semibold tracking-[-.06em] text-white sm:text-6xl lg:text-8xl">Make your career <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-cyan-200 bg-clip-text text-transparent">impossible to ignore.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Resumix turns a static resume into a living portfolio—crafted for the people who should remember your work.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.02]">Build your portfolio <ArrowRight className="h-4 w-4" /></Link><Link href="#features" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">See how it works</Link></div>
          <p className="mt-5 text-sm text-slate-400">No design experience needed. Your first portfolio is free.</p>
        </div>
        <CardContainer containerClassName="relative mx-auto w-full max-w-lg py-0"><CardBody className="relative h-auto w-full"><div className="absolute -inset-8 rounded-[2.5rem] bg-violet-500/20 blur-3xl" /><CardItem translateZ={40} className="glass-panel glow-border relative overflow-hidden rounded-[2rem] p-4 shadow-2xl"><div className="flex items-center gap-1.5 border-b border-white/10 px-2 pb-4"><i className="h-2 w-2 rounded-full bg-rose-400" /><i className="h-2 w-2 rounded-full bg-amber-300" /><i className="h-2 w-2 rounded-full bg-emerald-400" /><span className="ml-3 text-xs text-slate-500">your-portfolio.com</span></div><div className="m-2 rounded-2xl bg-gradient-to-br from-[#17234a] to-[#0d1125] p-7"><div className="mb-14 flex items-center justify-between text-xs text-slate-400"><b className="text-white">portfolio.</b><span>Work&nbsp;&nbsp; About&nbsp;&nbsp; Contact</span></div><CardItem translateZ={65}><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">Product designer</p><h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">I build digital experiences people love.</h2></CardItem><div className="mt-10 grid grid-cols-2 gap-3"><div className="h-28 rounded-xl bg-violet-400/25" /><div className="h-28 rounded-xl bg-cyan-300/15" /></div></div></CardItem></CardBody></CardContainer>
      </section>
      <section id="features" className="pb-28 pt-12"><div className="mb-10 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-violet-300">A clearer path forward</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">From document to destination.</h2></div><BentoGrid>{features.map(([Icon, title, description], index) => <BentoGridItem key={title as string} className="glass-panel glow-border relative overflow-hidden border-white/10 bg-[#10172b]/80 p-7 hover:shadow-violet-950/30" title={<span className="text-white">{title as string}</span>} description={<span className="text-slate-400">{description as string}</span>} icon={<div className="mt-2 inline-flex rounded-xl border border-violet-300/20 bg-violet-400/10 p-3 text-violet-200"><Icon className="h-5 w-5" /></div>} header={<span className="absolute right-5 top-4 text-6xl font-semibold text-white/[.035]">0{index + 1}</span>} />)}</BentoGrid></section>
      <section id="themes" className="pb-28"><div className="glass-panel glow-border rounded-3xl p-8 md:p-12"><div className="grid items-center gap-8 md:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">Built around you</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">One resume. Many ways to stand out.</h2><p className="mt-5 max-w-md leading-7 text-slate-400">Choose a template, tune your details, then publish with confidence.</p><Link href="/login" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-200 hover:text-white">Explore the builder <ArrowRight className="h-4 w-4" /></Link></div><div className="grid grid-cols-3 gap-3"><div className="h-52 rounded-xl bg-gradient-to-b from-slate-100 to-slate-300" /><div className="h-52 rounded-xl bg-gradient-to-b from-violet-500 to-indigo-950" /><div className="h-52 rounded-xl bg-gradient-to-b from-cyan-300 to-sky-700" /></div></div></div></section>
    </main>
    <footer className="relative border-t border-white/10 py-8 text-center text-sm text-slate-500">© 2026 Resumix. Your work deserves a better home.</footer>
  </div>;
}
