import React from 'react';
import AboutSection from '../AboutSection';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import SkillsSection from '../SkillsSection';
import ProjectsSection from '../ProjectsSection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MinimalTemplate({ portfolio }: { portfolio: any }) {
    const { name = 'User', headline, email, phone, theme } = portfolio;
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen font-sans ${isDark ? 'bg-neutral-900 text-neutral-200' : 'bg-white text-neutral-900'}`}>
            <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
                {/* Header */}
                <header className="mb-20 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            {name}
                        </h1>
                        {headline && (
                            <p className={`text-xl ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                {headline}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        {email && (
                            <a href={`mailto:${email}`} className="hover:underline underline-offset-4 decoration-2">
                                {email}
                            </a>
                        )}
                        {phone && (
                            <a href={`tel:${phone}`} className="hover:underline underline-offset-4 decoration-2">
                                {phone}
                            </a>
                        )}
                    </div>
                </header>

                <main className="space-y-24">
                    {portfolio.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-8 opacity-60">About</h2>
                            <div className="prose prose-lg dark:prose-invert">
                                <AboutSection about={portfolio.summary} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    {portfolio.experience?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-8 opacity-60">Experience</h2>
                            <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                        </section>
                    )}

                    {portfolio.projects?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-8 opacity-60">Projects</h2>
                            <ProjectsSection projects={portfolio.projects} isDark={isDark} />
                        </section>
                    )}

                    {portfolio.skills?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-8 opacity-60">Skills</h2>
                            <SkillsSection skills={portfolio.skills} isDark={isDark} />
                        </section>
                    )}

                    {portfolio.education?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-8 opacity-60">Education</h2>
                            <EducationSection education={portfolio.education} isDark={isDark} />
                        </section>
                    )}
                </main>

                <footer className={`mt-24 pt-8 text-sm ${isDark ? 'text-neutral-600 border-t border-neutral-800' : 'text-neutral-400 border-t border-neutral-100'}`}>
                    <p>© {new Date().getFullYear()} {name}</p>
                </footer>
            </div>
        </div>
    );
}
