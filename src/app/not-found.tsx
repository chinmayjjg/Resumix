import Link from "next/link";
import { ArrowLeft, LayoutDashboard, SearchX, Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b18] px-6 py-32 text-white">
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-[12%] top-[18%] h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
                <div className="absolute bottom-[12%] right-[10%] h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <section className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[.055] p-8 text-center shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:p-14">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-violet-300/15 bg-violet-400/10 blur-sm" aria-hidden="true" />
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/25 bg-violet-400/10 text-violet-200 shadow-lg shadow-violet-950/30">
                    <SearchX className="h-7 w-7" />
                </div>
                <p className="relative mt-8 text-xs font-semibold uppercase tracking-[.25em] text-violet-300">Lost in the workspace</p>
                <h1 className="relative mt-3 text-7xl font-semibold tracking-[-.08em] sm:text-9xl"><span className="bg-gradient-to-r from-violet-200 via-white to-cyan-200 bg-clip-text text-transparent">404</span></h1>
                <h2 className="relative mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">This page isn&apos;t in the portfolio.</h2>
                <p className="relative mx-auto mt-4 max-w-md leading-7 text-slate-300">The link may be out of date, or the page may have moved. Let&apos;s get you back to building something memorable.</p>
                <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-violet-100"><ArrowLeft className="h-4 w-4" />Back home</Link>
                    <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"><LayoutDashboard className="h-4 w-4" />Open dashboard</Link>
                </div>
                <div className="relative mt-9 flex items-center justify-center gap-2 text-xs text-slate-500"><Sparkles className="h-3.5 w-3.5 text-violet-300" />Resumix helps your work stand out.</div>
            </section>
        </div>
    );
}
