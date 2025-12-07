import React from 'react';
import AboutSection from '../AboutSection';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import SkillsSection from '../SkillsSection';
import ProjectsSection from '../ProjectsSection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ModernTemplate({ portfolio }: { portfolio: any }) {
    const { name = 'User', headline, email, phone, theme } = portfolio;
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>

            {/* Animated Background Blobs */}
            <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden`}>
                <div className={`absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] rounded-full blur-[100px] opacity-30 animate-pulse ${isDark ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
                <div className={`absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] rounded-full blur-[100px] opacity-30 animate-pulse delay-700 ${isDark ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
            </div>

            <div className="relative z-10 font-sans">
                {/* Full Screen Hero Section */}
                <header className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 relative">
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="inline-block relative">
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 pb-4">
                                {name}
                            </h1>
                        </div>

                        {headline && (
                            <p className={`text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                {headline}
                            </p>
                        )}

                        <div className="flex flex-wrap justify-center gap-6 pt-8">
                            {email && (
                                <a href={`mailto:${email}`} className="px-8 py-4 rounded-full bg-blue-600 text-white text-lg font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/30">
                                    Let&apos;s Connect
                                </a>
                            )}
                            {phone && (
                                <a href={`tel:${phone}`} className={`px-8 py-4 rounded-full border-2 border-current text-lg font-bold hover:scale-105 transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-white'}`}>
                                    {phone}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <svg className={`w-8 h-8 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-6 py-24 space-y-32">
                    {portfolio.summary && (
                        <div className={`p-8 md:p-12 rounded-3xl backdrop-blur-lg ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/50 border border-white/50 shadow-xl'}`}>
                            <AboutSection about={portfolio.summary} isDark={isDark} />
                        </div>
                    )}

                    {portfolio.skills?.length > 0 && <SkillsSection skills={portfolio.skills} isDark={isDark} />}

                    {portfolio.experience?.length > 0 && (
                        <div className="relative">
                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 opacity-20 rounded-full hidden md:block"></div>
                            <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                        </div>
                    )}

                    {portfolio.projects?.length > 0 && <ProjectsSection projects={portfolio.projects} isDark={isDark} />}

                    {portfolio.education?.length > 0 && (
                        <EducationSection education={portfolio.education} isDark={isDark} />
                    )}
                </main>

                <footer className={`py-12 text-center text-sm relative z-10 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                    <p>© {new Date().getFullYear()} {name}. Built effortlessly.</p>
                </footer>
            </div>
        </div>
    );
}
