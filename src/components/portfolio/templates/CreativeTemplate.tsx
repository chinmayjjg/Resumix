import React from 'react';
import Image from 'next/image';
import AboutSection from '../AboutSection';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import SkillsSection from '../SkillsSection';
import ProjectsSection from '../ProjectsSection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CreativeTemplate({ portfolio }: { portfolio: any }) {
    const { name = 'User', headline, email, phone, theme } = portfolio;
    const isDark = theme === 'dark';

    const bgClass = isDark ? 'bg-black text-white' : 'bg-yellow-300 text-black';
    const accentClass = isDark ? 'text-pink-500' : 'text-purple-600';
    const borderClass = isDark ? 'border-pink-500' : 'border-black';

    return (
        <div className={`min-h-screen ${bgClass} font-sans selection:bg-pink-500 selection:text-white overflow-hidden`}>

            {/* Massive Hero */}
            <header className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20 relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none skew-x-12"></div>

                <h1 className="text-[15vw] leading-[0.8] font-black tracking-tighter uppercase break-words mix-blend-difference z-10 transition-transform hover:scale-105 duration-500 origin-left relative">
                    {name}
                </h1>

                {portfolio.userImage && (
                    <div className="absolute top-1/2 right-10 md:right-32 -translate-y-1/2 w-[30vh] h-[30vh] md:w-[50vh] md:h-[50vh] z-0 opacity-80 mix-blend-multiply pointer-events-none grayscale contrast-125">
                        <Image src={portfolio.userImage} alt="Profile" fill className="object-cover rounded-full" unoptimized />
                        <div className="absolute inset-0 bg-yellow-300 mix-blend-color opacity-50 rounded-full"></div>
                    </div>
                )}

                <div className="max-w-3xl mt-12 z-10">
                    {headline && (
                        <p className={`text-2xl md:text-4xl font-bold mb-8 bg-white/10 p-4 inline-block transform -rotate-1`}>
                            {headline}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-8">
                        {email && (
                            <a href={`mailto:${email}`} className={`px-8 py-4 text-xl font-black uppercase border-4 ${borderClass} hover:bg-black hover:text-white hover:border-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2`}>
                                Contact
                            </a>
                        )}
                        {phone && (
                            <a href={`tel:${phone}`} className={`px-8 py-4 text-xl font-black uppercase border-4 ${borderClass} hover:bg-black hover:text-white hover:border-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2`}>
                                Call Me
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Asymmetric Content Grid */}
            <div className={`grid grid-cols-1 lg:grid-cols-12 min-h-screen`}>
                {/* Left Col - Projects */}
                <div className="lg:col-span-8 p-6 md:p-12 lg:p-24 space-y-32">
                    {portfolio.projects?.length > 0 && (
                        <section>
                            <h2 className={`text-6xl md:text-8xl font-black mb-16 uppercase italic ${accentClass}`}>Selected Works</h2>
                            <div className="grid gap-16">
                                <ProjectsSection projects={portfolio.projects} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    {portfolio.experience?.length > 0 && (
                        <section>
                            <h2 className={`text-6xl md:text-8xl font-black mb-16 uppercase italic ${accentClass}`}>History</h2>
                            <div className={`p-8 border-4 ${borderClass} shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)] bg-white/5`}>
                                <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Col - Info Sidebar */}
                <div className={`lg:col-span-4 p-6 md:p-12 space-y-16 border-l-4 ${borderClass} bg-white/5`}>
                    {portfolio.summary && (
                        <section>
                            <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-current inline-block pb-2">About</h2>
                            <div className="text-lg md:text-xl font-medium leading-relaxed">
                                <AboutSection about={portfolio.summary} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    {portfolio.skills?.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-current inline-block pb-2">Toolkit</h2>
                            <div className="flex flex-wrap gap-2">
                                {/* Custom styling for skills usually handled in component, but wrapper helps */}
                                <SkillsSection skills={portfolio.skills} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    {portfolio.education?.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-current inline-block pb-2">Education</h2>
                            <EducationSection education={portfolio.education} isDark={isDark} />
                        </section>
                    )}

                    <div className="pt-12 mt-12 border-t-4 border-current opacity-50">
                        <p className="font-bold uppercase tracking-widest">© {new Date().getFullYear()} {name}</p>
                        <p className="font-mono text-sm mt-2">Designed with Impact</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
