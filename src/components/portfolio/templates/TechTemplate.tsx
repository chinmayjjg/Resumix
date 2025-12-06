import React from 'react';
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
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono p-4 md:p-8">
            <div className="max-w-4xl mx-auto border border-[#30363d] rounded-lg bg-[#0d1117] shadow-xl overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    <div className="ml-4 text-xs text-[#8b949e]">user@{name.toLowerCase().replace(/\s+/g, '')}:~/portfolio</div>
                </div>

                <div className="p-6 md:p-12 space-y-12">
                    {/* Header */}
                    <header className="space-y-4">
                        <div className="flex items-center gap-2 text-[#58a6ff]">
                            <span className="text-[#8b949e]">$</span>
                            <span className="typewriter">whoami</span>
                        </div>
                        <div className="pl-4 border-l-2 border-[#30363d] space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-[#c9d1d9]">{name}</h1>
                            {headline && <p className="text-[#8b949e] text-xl">{headline}</p>}
                        </div>
                    </header>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-12">
                            <section>
                                <div className="flex items-center gap-2 text-[#58a6ff] mb-4">
                                    <span className="text-[#8b949e]">$</span>
                                    <span>cat contact.json</span>
                                </div>
                                <div className="bg-[#161b22] p-4 rounded border border-[#30363d] font-sm overflow-x-auto">
                                    <pre className="text-[#a5d6ff]">
                                        {`{
  "email": "${email || ''}",
  "phone": "${phone || ''}",
  "status": "Ready to code"
}`}
                                    </pre>
                                </div>
                            </section>

                            {portfolio.skills?.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-2 text-[#58a6ff] mb-4">
                                        <span className="text-[#8b949e]">$</span>
                                        <span>ls ./skills</span>
                                    </div>
                                    <SkillsSection skills={portfolio.skills} isDark={isDark} />
                                </section>
                            )}
                        </div>

                        <div className="space-y-12">
                            {portfolio.summary && (
                                <section>
                                    <div className="flex items-center gap-2 text-[#58a6ff] mb-4">
                                        <span className="text-[#8b949e]">$</span>
                                        <span>cat README.md</span>
                                    </div>
                                    <div className="pl-4">
                                        <AboutSection about={portfolio.summary} isDark={isDark} />
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {portfolio.experience?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 text-[#58a6ff] mb-4">
                                <span className="text-[#8b949e]">$</span>
                                <span>./experience.sh</span>
                            </div>
                            <div className="border-l border-[#30363d] pl-4">
                                <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    {portfolio.projects?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 text-[#58a6ff] mb-4">
                                <span className="text-[#8b949e]">$</span>
                                <span>git log --oneline --graph --decorate</span>
                            </div>
                            <ProjectsSection projects={portfolio.projects} isDark={isDark} />
                        </section>
                    )}

                    {portfolio.education?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 text-[#58a6ff] mb-4">
                                <span className="text-[#8b949e]">$</span>
                                <span>cat /etc/education</span>
                            </div>
                            <div className="pl-4">
                                <EducationSection education={portfolio.education} isDark={isDark} />
                            </div>
                        </section>
                    )}

                    <footer className="pt-12 mt-12 border-t border-[#30363d] text-center text-[#8b949e] text-sm">
                        <span className="text-[#27c93f]">➜</span> ~ exit 0
                    </footer>
                </div>
            </div>
        </div>
    );
}
