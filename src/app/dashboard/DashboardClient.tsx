'use client';

import { useState } from 'react';
import Link from "next/link";
import ThemeToggle from "@/components/ui/ui/ThemeToggle";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardClient({ portfolio, session }: { portfolio: any, session: any }) {
    const [theme, setTheme] = useState(portfolio?.theme || "light");

    return (
        <div className={theme}>
            <div className="min-h-screen bg-background text-foreground p-6">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/profile"
                            className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/dashboard/builder"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Edit Portfolio
                        </Link>
                        <ThemeToggle currentTheme={theme} userId={session.user.id} onToggle={setTheme} />
                    </div>
                </header>

                <section className="space-y-6">
                    {/* View My Portfolio Section */}
                    {portfolio && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Your Live Portfolio
                                    </h2>
                                    <p className="text-blue-700 dark:text-blue-300 text-sm">Share this link with recruiters and on your resume</p>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={`/portfolio/${session.user.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Portfolio
                                    </Link>
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/portfolio/${session.user.id}`;
                                            navigator.clipboard.writeText(url);
                                            alert('Portfolio link copied to clipboard!');
                                        }}
                                        className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium border-2 border-blue-300 dark:border-blue-700 flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-mono text-gray-600 dark:text-gray-300 break-all">
                                    {typeof window !== 'undefined' ? `${window.location.origin}/portfolio/${session.user.id}` : `/portfolio/${session.user.id}`}
                                </p>
                            </div>
                        </div>
                    )}

                    {!portfolio && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-lg text-gray-600 mb-4">No portfolio data yet.</p>
                            <Link
                                href="/dashboard/upload"
                                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors inline-block"
                            >
                                Upload Resume to Start
                            </Link>
                        </div>
                    )}

                    {portfolio && (
                        <div className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-semibold">Portfolio Preview</h2>
                                <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                                    Theme: {theme}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-500">About</h3>
                                    <p className="mt-1">{portfolio.summary || portfolio.about || "No summary added yet."}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-500">Skills</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {portfolio.skills?.length > 0 ? (
                                            portfolio.skills.map((skill: string, i: number) => (
                                                <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm border">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 italic">No skills listed</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-500">Projects</h3>
                                    <p className="mt-1">{portfolio.projects?.length || 0} projects added</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
