import React from 'react';
import Image from 'next/image';
import AboutSection from '../AboutSection';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import SkillsSection from '../SkillsSection';
import ProjectsSection from '../ProjectsSection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TechTemplate({ portfolio }: { portfolio: any }) {
    const { name = 'User', headline, email, phone } = portfolio;
    // Tech template is always dark/terminal style
    const isDark = true;

    return (
        <div className="min-h-screen bg-[#050a0f] text-[#00ff41] font-mono selection:bg-[#003b00] selection:text-[#00ff41] overflow-x-hidden relative">

            {/* CRT Overlay Effects */}
            <div className="pointer-events-none fixed inset-0 z-50 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)]"></div>
            <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>

            <div className="p-4 md:p-8 relative z-10">
                <div className="max-w-7xl mx-auto border border-[#003b00] bg-[#0d1117] shadow-[0_0_20px_rgba(0,255,65,0.1)] min-h-[95vh] flex flex-col">

                    {/* Terminal Header */}
                    <div className="bg-[#161b22] px-4 py-2 border-b border-[#003b00] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <div className="text-xs text-[#00ff41] opacity-70">root@{name.toLowerCase().replace(/\s+/g, '')}:~</div>
                        <div className="w-16"></div>
                    </div>

                    <div className="p-6 md:p-12 lg:p-20 flex-1 flex flex-col space-y-20">
                        {/* Hero Command */}
                        <header className="space-y-6 min-h-[40vh] flex flex-col justify-center border-b border-[#003b00] pb-20">
                            <div className="flex items-center gap-3 text-[#00ff41] mb-2 text-xl">
                                <span className="">➜</span>
                                <span className="opacity-70">~</span>
                                <span className="animate-pulse">_</span>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-bold text-[#00ff41] tracking-tight glitch-effect" style={{ textShadow: "0 0 10px rgba(0,255,65,0.5)" }}>
                                {name}
                            </h1>

                            {portfolio.userImage && (
                                <div className="mt-8 relative w-48 h-48 group">
                                    <div className="absolute inset-0 bg-[#00ff41] opacity-20 animate-pulse rounded-sm"></div>
                                    <div className="absolute inset-0 border-2 border-[#00ff41] rounded-sm bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00ff41_3px)] opacity-30"></div>

                                    {/* Corners */}
                                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]"></div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]"></div>
                                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]"></div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]"></div>

                                    <Image
                                        src={portfolio.userImage}
                                        alt="Profile"
                                        fill
                                        sizes="(max-width: 768px) 192px, 192px"
                                        className="object-cover opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 filter contrast-125"
                                        style={{ imageRendering: 'pixelated' }}
                                        unoptimized
                                    />
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff41] shadow-[0_0_10px_#00ff41] animate-[scan_2s_linear_infinite] opacity-50 pointer-events-none"></div>
                                </div>
                            )}

                            {headline && (
                                <div className="text-[#00ff41] text-xl md:text-2xl opacity-80 pl-4 border-l-2 border-[#003b00] py-2">
                                    <span className="opacity-50">{'// '}</span>{headline}
                                </div>
                            )}

                            <div className="pt-8 text-[#00ff41]">
                                <p className="mb-2 opacity-50"># System Status: ONLINE</p>
                                <p className="mb-2 opacity-50"># Available for hire: {email ? 'YES' : 'NO'}</p>
                            </div>
                        </header>

                        {/* Main Grid */}
                        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
                            <div className="space-y-16">
                                <section>
                                    <h3 className="text-[#00ff41] mb-6 text-xl flex items-center gap-2">
                                        <span className="opacity-50">./</span>contact_info.json
                                    </h3>
                                    <div className="bg-[#050a0f] p-6 border border-[#003b00] font-sm overflow-x-auto shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                        <pre className="text-[#00ff41]">
                                            {`{
  "email": "${email || 'N/A'}",
  "phone": "${phone || 'N/A'}",
  "encrypted": false
}`}
                                        </pre>
                                    </div>
                                </section>

                                {portfolio.summary && (
                                    <section>
                                        <h3 className="text-[#00ff41] mb-6 text-xl flex items-center gap-2">
                                            <span className="opacity-50">cat</span> README.md
                                        </h3>
                                        <div className="prose prose-invert prose-p:text-[#00ff41] prose-headings:text-[#00ff41] opacity-90">
                                            <AboutSection about={portfolio.summary} isDark={isDark} />
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="space-y-16">
                                {portfolio.skills?.length > 0 && (
                                    <section>
                                        <h3 className="text-[#00ff41] mb-6 text-xl flex items-center gap-2">
                                            <span className="opacity-50">ls -la</span> ./modules
                                        </h3>
                                        {/* CSS Hack to recolor child components */}
                                        <div className="tech-skills-wrapper">
                                            <SkillsSection skills={portfolio.skills} isDark={isDark} />
                                        </div>
                                    </section>
                                )}

                                {portfolio.experience?.length > 0 && (
                                    <section>
                                        <h3 className="text-[#00ff41] mb-6 text-xl flex items-center gap-2">
                                            <span className="opacity-50">./</span>run_experience.sh
                                        </h3>
                                        <div className="border-l border-[#003b00] pl-6 ml-2">
                                            <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>

                        {portfolio.projects?.length > 0 && (
                            <section className="pt-12 border-t border-[#003b00]">
                                <h3 className="text-[#00ff41] mb-8 text-xl flex items-center gap-2">
                                    <span className="opacity-50">git log</span> --projects
                                </h3>
                                <div className="grid gap-8">
                                    <ProjectsSection projects={portfolio.projects} isDark={isDark} />
                                </div>
                            </section>
                        )}

                        {portfolio.education?.length > 0 && (
                            <section>
                                <h3 className="text-[#00ff41] mb-8 text-xl flex items-center gap-2">
                                    <span className="opacity-50">cat</span> /etc/education
                                </h3>
                                <div className="pl-4">
                                    <EducationSection education={portfolio.education} isDark={isDark} />
                                </div>
                            </section>
                        )}

                        <footer className="pt-20 text-center text-[#00ff41] text-xs opacity-50 flex flex-col gap-2 items-center">
                            <span>SESSION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            <span>TERMINATED.</span>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}
