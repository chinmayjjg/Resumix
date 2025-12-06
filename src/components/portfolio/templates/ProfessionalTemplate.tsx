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

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Sidebar / Header */}
                <aside className={`md:w-80 lg:w-96 flex-shrink-0 p-8 flex flex-col justify-between ${isDark ? 'bg-gray-800' : 'bg-white border-r border-gray-200'}`}>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-blue-600">{name}</h1>
                            {headline && (
                                <p className={`text-lg font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {headline}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4 text-sm">
                            {email && (
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 text-blue-600">✉</span>
                                    <a href={`mailto:${email}`} className="hover:text-blue-600 transition-colors">{email}</a>
                                </div>
                            )}
                            {phone && (
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 text-blue-600">📞</span>
                                    <a href={`tel:${phone}`} className="hover:text-blue-600 transition-colors">{phone}</a>
                                </div>
                            )}
                        </div>

                        {portfolio.skills?.length > 0 && (
                            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-gray-500">Expertise</h3>
                                <SkillsSection skills={portfolio.skills} isDark={isDark} />
                            </div>
                        )}
                    </div>

                    <footer className="mt-12 text-xs text-gray-400">
                        © {new Date().getFullYear()} {name}
                    </footer>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-16">
                        {portfolio.summary && (
                            <section className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                                <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">About Me</h2>
                                <AboutSection about={portfolio.summary} isDark={isDark} />
                            </section>
                        )}

                        {portfolio.experience?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-blue-600 rounded-sm"></span>
                                    Experience
                                </h2>
                                <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                            </section>
                        )}

                        {portfolio.projects?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-purple-600 rounded-sm"></span>
                                    Projects
                                </h2>
                                <ProjectsSection projects={portfolio.projects} isDark={isDark} />
                            </section>
                        )}

                        {portfolio.education?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-green-600 rounded-sm"></span>
                                    Education
                                </h2>
                                <EducationSection education={portfolio.education} isDark={isDark} />
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
