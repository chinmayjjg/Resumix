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
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-neutral-900 text-neutral-300' : 'bg-neutral-50 text-neutral-800'} font-serif relative`}>
            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            <div className="max-w-3xl mx-auto px-8 py-24 md:py-40 relative z-10">

                {/* Minimal Header */}
                <header className="mb-32 space-y-8 text-center flex flex-col items-center">
                    {portfolio.userImage && (
                        <div className="relative group mb-8">
                            <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 rounded-full transition-opacity duration-500 scale-125"></div>
                            <img
                                src={portfolio.userImage}
                                alt="Profile"
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover grayscale brightness-110 contrast-125 hover:grayscale-0 transition-all duration-700 ease-out"
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-xs font-sans font-bold tracking-[0.4em] uppercase opacity-40">Portfolio</p>
                        <h1 className="text-5xl md:text-8xl font-light tracking-wide text-current">
                            {name}
                        </h1>
                        {headline && (
                            <div className="w-12 h-px bg-current mx-auto opacity-30 my-8"></div>
                        )}
                        {headline && (
                            <p className="text-lg md:text-xl italic opacity-60 max-w-md mx-auto leading-loose">
                                {headline}
                            </p>
                        )}
                    </div>
                </header>

                <main className="space-y-32">
                    {portfolio.summary && (
                        <section className="text-center">
                            <div className="prose prose-lg mx-auto prose-neutral dark:prose-invert font-light leading-loose">
                                <AboutSection about={portfolio.summary} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    {portfolio.projects?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-16">
                                <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase opacity-40 shrink-0">Selected Works</span>
                                <div className="h-px bg-current w-full opacity-10"></div>
                            </div>
                            <div className="grid gap-20">
                                <ProjectsSection projects={portfolio.projects} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    {portfolio.experience?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-16">
                                <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase opacity-40 shrink-0">Experience</span>
                                <div className="h-px bg-current w-full opacity-10"></div>
                            </div>
                            <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                        </section>
                    )}

                    <div className="grid md:grid-cols-2 gap-16 pt-16 border-t border-current/10">
                        {portfolio.skills?.length > 0 && (
                            <section>
                                <h3 className="text-xs font-sans font-bold tracking-[0.2em] uppercase opacity-40 mb-8">Expertise</h3>
                                <SkillsSection skills={portfolio.skills} isDark={isDark} />
                            </section>
                        )}

                        {portfolio.education?.length > 0 && (
                            <section>
                                <h3 className="text-xs font-sans font-bold tracking-[0.2em] uppercase opacity-40 mb-8">Education</h3>
                                <EducationSection education={portfolio.education} isDark={isDark} />
                            </section>
                        )}
                    </div>
                </main>

                <footer className="mt-40 pt-12 border-t border-current/10 flex flex-col items-center gap-8">
                    <div className="flex gap-8 text-sm font-sans tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
                        {email && <a href={`mailto:${email}`}>Email</a>}
                        {phone && <a href={`tel:${phone}`}>Phone</a>}
                    </div>
                    <p className="text-xs font-sans opacity-30">
                        © {new Date().getFullYear()} {name}
                    </p>
                </footer>
            </div>
        </div>
    );
}
