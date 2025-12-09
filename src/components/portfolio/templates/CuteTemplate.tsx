import React from 'react';
import { IPortfolio } from '@/models/Portfolio';
import { Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

// Using 'any' for portfolio temporarily to avoid strict type checks if parent passes partial data not fully matching IPortfolio yet, 
// but referencing IPortfolio for structure.
// In ProfessionalTemplate it uses 'any', we can try to be stricter but for now let's match the pattern to avoid errors.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CuteTemplate({ portfolio }: { portfolio: any }) {
    const {
        name,
        headline,
        email,
        phone,
        summary, // This maps to "About" usually
        experience = [],
        education = [],
        projects = [],
        skills = [],
        // location is not in top level IPortfolio interface in the file I read, but assuming it might be passed if it exists in data
        // If not, we omit it or check if it's in a different field.
    } = portfolio;

    return (
        <div className="min-h-screen bg-pink-50 font-sans text-slate-800 selection:bg-pink-200">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 left-10 text-4xl opacity-20 transform -rotate-12">🐱</div>
                <div className="absolute top-20 right-20 text-5xl opacity-20 transform rotate-12">🌸</div>
                <div className="absolute bottom-20 left-20 text-5xl opacity-20 transform rotate-45">🌸</div>
                <div className="absolute bottom-10 right-10 text-4xl opacity-20 transform -rotate-12">🐱</div>
                <div className="absolute top-1/2 left-10 text-3xl opacity-10">✨</div>
                <div className="absolute top-1/3 right-10 text-3xl opacity-10">✨</div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">

                {/* Header / Hero */}
                <header className="text-center mb-16 relative">
                    <div className="inline-block p-2 rounded-full border-4 border-pink-200 bg-white mb-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-pink-100 flex items-center justify-center">
                            <span className="text-6xl">👩‍💻</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-pink-500 mb-4 tracking-tight" style={{ textShadow: '2px 2px 0px rgba(251, 207, 232, 1)' }}>
                        {name || 'Your Name'}
                    </h1>
                    <p className="text-xl md:text-2xl text-pink-400 font-medium mb-8">
                        {headline || 'Creative Developer'}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 text-slate-600">
                        {email && (
                            <a href={`mailto:${email}`} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:text-pink-500 transition-all border-2 border-transparent hover:border-pink-200">
                                <Mail size={18} />
                                <span>{email}</span>
                            </a>
                        )}
                        {phone && (
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border-2 border-transparent">
                                <Phone size={18} />
                                <span>{phone}</span>
                            </div>
                        )}
                        {/* Location is not in IPortfolio clearly, omitting for now to be safe, or could be part of a custom field */}
                    </div>

                    {summary && (
                        <p className="mt-8 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed bg-white/50 p-6 rounded-2xl backdrop-blur-sm border border-pink-100 shadow-sm">
                            {summary}
                        </p>
                    )}
                </header>

                {/* Skills - Floating Bubbles */}
                {skills && skills.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-10 flex items-center justify-center gap-3">
                            <span className="text-pink-400">✨</span> Skills <span className="text-pink-400">✨</span>
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {skills.map((skill: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-6 py-3 bg-white text-pink-500 rounded-full shadow-sm border-b-4 border-pink-200 font-bold hover:translate-y-1 hover:border-b-0 hover:mb-[4px] transition-all cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience - Cute Timeline */}
                {experience && experience.length > 0 && (
                    <section className="mb-20 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12 flex items-center justify-center gap-3">
                            <span className="text-pink-400">🏢</span> Work History
                        </h2>
                        <div className="space-y-8 relative before:absolute before:left-8 md:before:left-1/2 before:top-0 before:bottom-0 before:w-1 before:bg-pink-200 before:-ml-0.5">
                            {experience.map((exp: any, index: number) => (
                                <div key={index} className="relative flex flex-col md:flex-row gap-8 items-center md:even:flex-row-reverse">
                                    <div className="hidden md:block w-1/2" />

                                    {/* Timeline Dot */}
                                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-pink-400 rounded-full border-4 border-white shadow-md z-10 -ml-2 transform md:translate-x-0" />

                                    <div className="w-full md:w-1/2 pl-16 md:pl-0 md:pr-12 md:even:pl-12 md:even:pr-0">
                                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-pink-50 relative group">
                                            <div className="absolute -top-3 -right-3 text-2xl transform group-hover:rotate-12 transition-transform duration-300">🐱</div>
                                            <h3 className="font-bold text-xl text-slate-800">{exp.position}</h3>
                                            <div className="text-pink-500 font-bold mb-2">{exp.company}</div>
                                            <div className="text-sm text-slate-400 font-medium mb-3 bg-pink-50 inline-block px-3 py-1 rounded-full">
                                                {exp.startDate} - {exp.endDate}
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects - Cards */}
                {projects && projects.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12 flex items-center justify-center gap-3">
                            <span className="text-pink-400">🚀</span> My Projects
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((project: any, index: number) => (
                                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-pink-100 hover:border-pink-300 transition-all hover:-translate-y-2">
                                    <div className="h-3 bg-gradient-to-r from-pink-300 to-rose-300" />
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{project.name}</h3>
                                        <p className="text-slate-600 mb-6 leading-relaxed">{project.description}</p>
                                        <div className="pt-6 border-t border-pink-50 flex gap-4">
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-500 font-bold hover:text-pink-600">
                                                    <ExternalLink size={18} /> View Project
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education - Simple & Clean */}
                {education && education.length > 0 && (
                    <section className="mb-20 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12 flex items-center justify-center gap-3">
                            <span className="text-pink-400">🎓</span> Education
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {education.map((edu: any, index: number) => (
                                <div key={index} className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-pink-100 flex items-start gap-4 hover:bg-white transition-colors">
                                    <div className="p-3 bg-pink-100 rounded-xl text-pink-500">
                                        <Heart size={24} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{edu.degree}</h3> {/* Changed from subject to degree */}
                                        <div className="text-pink-500 font-medium">{edu.institution}</div>
                                        <div className="text-sm text-slate-400 mt-1">{edu.startYear} - {edu.endYear}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <footer className="text-center text-slate-400 py-10 mt-20 border-t border-pink-100">
                    <p className="flex items-center justify-center gap-2">
                        Made with <Heart size={16} className="text-pink-500" fill="currentColor" /> and 🐱
                    </p>
                </footer>

            </div>
        </div>
    );
}
