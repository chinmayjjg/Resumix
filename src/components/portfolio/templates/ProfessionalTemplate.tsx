import React from 'react';
import AboutSection from '../AboutSection';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import SkillsSection from '../SkillsSection';
import ProjectsSection from '../ProjectsSection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfessionalTemplate({ portfolio }: { portfolio: any }) {
    const { name = 'User', headline, email, phone, theme } = portfolio;
    const isDark = theme === 'dark';

    const bgClass = isDark ? 'bg-slate-900' : 'bg-slate-50';
    const cardClass = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
    const textClass = isDark ? 'text-slate-200' : 'text-slate-700';

    return (
        <div className={`min-h-screen ${bgClass} font-sans ${textClass} flex flex-col md:flex-row`}>

            {/* Fixed Left Sidebar */}
            <aside className={`w-full md:w-80 lg:w-96 md:h-screen md:fixed flex flex-col justify-between p-8 md:p-12 z-10 ${isDark ? 'bg-slate-950' : 'bg-slate-900'} text-white`}>
                <div className="space-y-8">
                    <div className="w-20 h-2 bg-blue-500 mb-8"></div>
                    {portfolio.userImage && (
                        <div className="mb-8">
                            <img src={portfolio.userImage} alt="Profile" className="w-32 h-32 rounded-lg object-cover shadow-lg border-2 border-white/20" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-serif font-bold leading-tight tracking-tight mb-4">
                            {name}
                        </h1>
                        {headline && (
                            <p className="text-blue-200 text-lg font-light leading-relaxed">
                                {headline}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4 pt-8 border-t border-white/10">
                        {email && (
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-widest text-slate-400 mb-1">Email</span>
                                <a href={`mailto:${email}`} className="hover:text-blue-300 transition-colors font-medium">{email}</a>
                            </div>
                        )}
                        {phone && (
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-widest text-slate-400 mb-1">Phone</span>
                                <a href={`tel:${phone}`} className="hover:text-blue-300 transition-colors font-medium">{phone}</a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 md:mt-0 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} {name}</p>
                    <p>Professional Portfolio</p>
                </div>
            </aside>

            {/* Main Content Scrollable */}
            <main className="flex-1 md:ml-80 lg:ml-96 p-8 md:p-16 lg:p-24 space-y-20">

                {portfolio.summary && (
                    <section className="max-w-3xl">
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-6 text-blue-500`}>Executive Summary</h2>
                        <div className={`p-8 rounded-lg border-l-4 border-blue-500 ${cardClass} shadow-sm`}>
                            <AboutSection about={portfolio.summary} isDark={isDark} />
                        </div>
                    </section>
                )}

                {portfolio.experience?.length > 0 && (
                    <section className="max-w-4xl">
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-8 text-blue-500 flex items-center gap-4`}>
                            Professional Experience
                            <span className="flex-1 h-px bg-slate-200"></span>
                        </h2>
                        <div className="space-y-8">
                            <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                        </div>
                    </section>
                )}

                {portfolio.projects?.length > 0 && (
                    <section className="max-w-6xl">
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-8 text-blue-500 flex items-center gap-4`}>
                            Key Projects
                            <span className="flex-1 h-px bg-slate-200"></span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <ProjectsSection projects={portfolio.projects} isDark={isDark} />
                        </div>
                    </section>
                )}

                <div className="grid md:grid-cols-2 gap-12">
                    {portfolio.skills?.length > 0 && (
                        <section>
                            <h2 className={`text-sm font-bold uppercase tracking-widest mb-6 text-blue-500`}>Core Competencies</h2>
                            <div className={`${cardClass} p-8 rounded-lg shadow-sm`}>
                                <SkillsSection skills={portfolio.skills} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    {portfolio.education?.length > 0 && (
                        <section>
                            <h2 className={`text-sm font-bold uppercase tracking-widest mb-6 text-blue-500`}>Education</h2>
                            <div className={`${cardClass} p-8 rounded-lg shadow-sm`}>
                                <EducationSection education={portfolio.education} isDark={isDark} />
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
