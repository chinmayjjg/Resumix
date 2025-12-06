import React from 'react';
import AboutSection from '../AboutSection';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import SkillsSection from '../SkillsSection';
import ProjectsSection from '../ProjectsSection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CreativeTemplate({ portfolio }: { portfolio: any }) {
    const { name = 'User', headline, email, phone, theme } = portfolio;
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-[#fff0e5] text-[#333]'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <header className="py-24 text-center">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 relative inline-block">
                        <span className="relative z-10">{name}</span>
                        <span className={`absolute top-2 left-2 w-full h-full -z-0 ${isDark ? 'bg-pink-600' : 'bg-yellow-400'}`}></span>
                    </h1>
                    {headline && (
                        <p className="text-2xl md:text-3xl font-bold mt-8 max-w-2xl mx-auto">
                            {headline}
                        </p>
                    )}
                    <div className="flex justify-center gap-6 mt-12">
                        {email && (
                            <a href={`mailto:${email}`} className={`px-8 py-4 font-bold text-lg border-2 ${isDark ? 'border-white hover:bg-white hover:text-black' : 'border-black hover:bg-black hover:text-white'} transition-all`}>
                                Say Hello
                            </a>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                    <div className="md:col-span-8 space-y-24">
                        {portfolio.projects?.length > 0 && (
                            <section>
                                <h2 className="text-4xl font-black mb-12 italic">SELECTED WORKS</h2>
                                <ProjectsSection projects={portfolio.projects} isDark={isDark} />
                            </section>
                        )}

                        {portfolio.experience?.length > 0 && (
                            <section>
                                <h2 className="text-4xl font-black mb-12 italic">EXPERIENCE</h2>
                                <div className={`p-8 border-4 ${isDark ? 'border-pink-600' : 'border-yellow-400'}`}>
                                    <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="md:col-span-4 space-y-16">
                        {portfolio.summary && (
                            <section className={`${isDark ? 'bg-pink-600' : 'bg-yellow-400'} p-8 text-black rotate-1 hover:rotate-0 transition-transform`}>
                                <h2 className="text-2xl font-black mb-4 uppercase">Profile</h2>
                                <AboutSection about={portfolio.summary} isDark={isDark} />
                            </section>
                        )}

                        {portfolio.skills?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black mb-6 uppercase border-b-4 border-current inline-block">Toolkit</h2>
                                <SkillsSection skills={portfolio.skills} isDark={isDark} />
                            </section>
                        )}

                        {portfolio.education?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black mb-6 uppercase border-b-4 border-current inline-block">Learning</h2>
                                <EducationSection education={portfolio.education} isDark={isDark} />
                            </section>
                        )}

                        <div className="text-center md:text-left">
                            {phone && (
                                <a href={`tel:${phone}`} className="text-xl font-bold hover:underline">{phone}</a>
                            )}
                        </div>
                    </aside>
                </div>

                <footer className="py-12 text-center font-bold uppercase tracking-widest text-sm opacity-50">
                    © {name} {new Date().getFullYear()} • KEEP CREATING
                </footer>
            </div>
        </div>
    );
}
