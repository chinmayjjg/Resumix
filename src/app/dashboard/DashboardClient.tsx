'use client';

import { useState } from 'react';
import Link from "next/link";
import ThemeToggle from "@/components/ui/ui/ThemeToggle";
import { Sparkles, ExternalLink, Copy, Check } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardClient({ portfolio, session }: { portfolio: any, session: any }) {
    const [theme, setTheme] = useState(portfolio?.theme || "light");

    return (
        <div className={theme}>
            <div className="min-h-screen bg-background text-foreground p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Welcome back, {session.user.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/profile"
                            className="text-muted-foreground hover:text-primary font-medium transition-colors"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/dashboard/builder"
                            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-md hover:translate-y-[-1px] flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Open Builder
                        </Link>
                        <div className="bg-white/50 p-1 rounded-full border border-slate-200">
                            <ThemeToggle currentTheme={theme} userId={session.user.id} onToggle={setTheme} />
                        </div>
                    </div>
                </header>

                <section className="space-y-8">
                    {/* View My Portfolio Section */}
                    {portfolio && (
                        <div className="relative overflow-hidden bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-white/60 shadow-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

                            <div className="flex items-center justify-between flex-wrap gap-6">
                                <div>
                                    <h2 className="text-2xl font-serif font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <Sparkles className="w-6 h-6 text-primary" />
                                        Your Live Portfolio
                                    </h2>
                                    <p className="text-muted-foreground">Share this link with recruiters and on your resume</p>
                                </div>
                                <div className="flex gap-4">
                                    <Link
                                        href={`/portfolio/${session.user.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        View Portfolio
                                    </Link>
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/portfolio/${session.user.id}`;
                                            navigator.clipboard.writeText(url);
                                            alert('Portfolio link copied to clipboard!');
                                        }}
                                        className="bg-white text-foreground px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors font-medium border border-slate-200 shadow-sm flex items-center gap-2"
                                    >
                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-colors"
                                onClick={() => {
                                    const url = `${window.location.origin}/portfolio/${session.user.id}`;
                                    navigator.clipboard.writeText(url);
                                }}
                            >
                                <p className="text-sm font-mono text-muted-foreground break-all">
                                    {typeof window !== 'undefined' ? `${window.location.origin}/portfolio/${session.user.id}` : `/portfolio/${session.user.id}`}
                                </p>
                                <Copy className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    )}

                    {!portfolio && (
                        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30">
                            <p className="text-lg text-muted-foreground mb-6">No portfolio data yet.</p>
                            <Link
                                href="/dashboard/upload"
                                className="bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-lg inline-flex items-center gap-2 font-medium"
                            >
                                <Sparkles className="w-5 h-5" />
                                Upload Resume to Start
                            </Link>
                        </div>
                    )}

                    {portfolio && (
                        <div className="p-8 border border-white/60 bg-white/40 backdrop-blur-sm rounded-2xl shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-serif font-semibold text-foreground">Portfolio Preview</h2>
                                <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-secondary">
                                    Theme: {theme}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <h3 className="font-medium text-muted-foreground mb-3 text-sm uppercase tracking-wide">About</h3>
                                    <p className="text-foreground line-clamp-3 leading-relaxed text-sm">
                                        {portfolio.summary || portfolio.about || "No summary added yet."}
                                    </p>
                                </div>

                                <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <h3 className="font-medium text-muted-foreground mb-3 text-sm uppercase tracking-wide">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.skills?.length > 0 ? (
                                            portfolio.skills.slice(0, 8).map((skill: string, i: number) => (
                                                <span key={i} className="bg-secondary/30 text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium border border-secondary/20">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 italic text-sm">No skills listed</p>
                                        )}
                                        {portfolio.skills?.length > 8 && (
                                            <span className="text-xs text-muted-foreground py-1 px-1">+{portfolio.skills.length - 8} more</span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <h3 className="font-medium text-muted-foreground mb-3 text-sm uppercase tracking-wide">Projects</h3>
                                    <div className="flex items-center justify-center h-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                        <p className="font-serif text-2xl text-primary">{portfolio.projects?.length || 0}</p>
                                        <p className="ml-2 text-sm text-muted-foreground">projects added</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
