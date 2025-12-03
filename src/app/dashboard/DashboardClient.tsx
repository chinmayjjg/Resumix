'use client';

import { useState } from 'react';
import Link from "next/link";
import ThemeToggle from "@/components/ui/ui/ThemeToggle";

export default function DashboardClient({ portfolio, session }: { portfolio: any, session: any }) {
    const [theme, setTheme] = useState(portfolio?.theme || "light");

    return (
        <div className={theme}>
            <div className="min-h-screen bg-background text-foreground p-6">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex items-center gap-4">
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
