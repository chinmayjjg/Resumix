'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import ThemePreviewGrid from '@/components/portfolio/ThemePreviewGrid';
import { IPortfolio } from '@/models/Portfolio';
import { Sparkles, Save, Upload, Eye, Palette, ArrowLeft, X } from 'lucide-react';

interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Education {
    institution: string;
    degree: string;
    startYear: string;
    endYear: string;
}

interface Project {
    name: string;
    description: string;
    link?: string;
}

interface PortfolioData {
    name: string;
    email: string;
    phone: string;
    headline: string;
    summary: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
    theme: 'light' | 'dark';
    userId?: string;
    template?: string;
    userImage?: string; // URL of uploaded profile picture
}

const initialData: PortfolioData = {
    name: '',
    email: '',
    phone: '',
    headline: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    theme: 'light',
    userImage: undefined,
};

export default function BuilderPage() {
    const router = useRouter();
    const [data, setData] = useState<PortfolioData>(initialData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showThemeModal, setShowThemeModal] = useState(false);

    useEffect(() => {
        fetchPortfolio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await fetch('/api/portfolio/me');

            if (res.status === 401) {
                router.push('/auth/login');
                return;
            }

            const json = await res.json();
            if (json.portfolio) {
                setData({
                    ...initialData,
                    ...json.portfolio,
                    userImage: json.portfolio.userImage || undefined
                });
            }
        } catch (err) {
            console.error('Failed to fetch portfolio', err);
        } finally {
            setLoading(false);
        }
    };

    // Handler for uploading profile picture
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });
            const result = await res.json();
            if (result.url) {
                handleChange('userImage', result.url);
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            console.error('Upload error', err);
            alert('Upload error');
        }
    };

    const handleDeleteImage = () => {
        if (confirm('Are you sure you want to remove your profile picture?')) {
            handleChange('userImage', '');
        }
    };

    const handleReuploadCv = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm('This will overwrite your existing portfolio data with the new resume content. Do you want to continue?')) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Upload failed');

            const { parsedData } = result;

            // Merge logic: Overwrite text fields, append or replace arrays? 
            // For now, let's overwrite base fields and append arrays if not empty? 
            // The prompt said "reupload cv feature", implying a refresh. Let's overwrite but keep current theme/ID.

            setData(prev => ({
                ...prev,
                name: parsedData.name || prev.name,
                email: parsedData.email || prev.email,
                phone: parsedData.phone || prev.phone,
                skills: parsedData.skills || [],
                // Map projects if needed or keep existing if parser is weak
                projects: parsedData.projects?.map((p: { title: string; summary: string }) => ({
                    name: p.title,
                    description: p.summary,
                    link: ''
                })) || [],
                // We keep the image and theme
            }));

            alert('Resume re-uploaded and data updated!');
        } catch (err) {
            console.error('Re-upload error', err);
            alert('Error re-uploading resume');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (field: keyof PortfolioData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: 'experience' | 'education' | 'projects', index: number, subField: string, value: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newArray = [...data[field]] as any[];
        newArray[index][subField] = value;
        setData(prev => ({ ...prev, [field]: newArray }));
    };

    const addItem = (field: 'experience' | 'education' | 'projects') => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newArray = [...data[field]] as any[];
        if (field === 'experience') newArray.push({ company: '', position: '', startDate: '', endDate: '', description: '' });
        else if (field === 'education') newArray.push({ institution: '', degree: '', startYear: '', endYear: '' });
        else if (field === 'projects') newArray.push({ name: '', description: '', link: '' });

        setData(prev => ({ ...prev, [field]: newArray }));
    };

    const removeItem = (field: 'experience' | 'education' | 'projects', index: number) => {
        const newArray = [...data[field]];
        newArray.splice(index, 1);
        setData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const skills = e.target.value.split(',').map(s => s.trim());
        setData(prev => ({ ...prev, skills }));
    };

    const savePortfolio = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/portfolio/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to save');

            alert('Portfolio saved successfully!');
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Error saving portfolio');
        } finally {
            setSaving(false);
        }
    };

    const handleThemeSwitch = async (newTemplate: string) => {
        // Optimistic update
        const updatedData = { ...data, template: newTemplate };
        setData(updatedData); // Update local state immediately to reflect if needed
        setShowThemeModal(false);

        // Save to background
        try {
            await fetch('/api/portfolio/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
        } catch (err) {
            console.error('Failed to save theme change', err);
            alert('Failed to save theme change');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/20">
            {/* Background Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl"></div>
            </div>
            {/* Custom Builder Navbar */}
            <nav className="fixed w-full top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-serif font-bold text-foreground">
                            Builder
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Re-upload CV Hidden Input & Button */}
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf"
                            id="reupload-cv-nav"
                            onChange={handleReuploadCv}
                            className="hidden"
                        />
                        <label
                            htmlFor="reupload-cv-nav"
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg cursor-pointer transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">Re-upload Resume</span>
                        </label>
                    </div>

                    <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                    <button
                        onClick={() => setShowThemeModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-secondary-foreground/80 hover:text-secondary-foreground hover:bg-secondary/20 rounded-lg transition-colors"
                    >
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">Theme</span>
                    </button>

                    {data.userId && (
                        <a
                            href={`/portfolio/${data.userId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View Live</span>
                        </a>
                    )}

                    <button
                        onClick={savePortfolio}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all text-sm"
                    >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>

                    <div className="ml-2 pl-2 border-l border-slate-200">
                        <button
                            onClick={() => router.push('/dashboard/profile')}
                            className="relative w-9 h-9 rounded-full bg-slate-100 overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all border border-slate-200"
                            title="Profile"
                        >
                            {data.userImage ? (
                                <Image
                                    src={data.userImage}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary text-xs font-bold font-serif">U</div>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Theme Selection Modal */}
            {showThemeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl">
                        <button
                            onClick={() => setShowThemeModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-50 bg-slate-100 rounded-full p-2 hover:bg-slate-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-3xl font-serif font-bold mb-8 text-center text-foreground">Choose Your Style</h2>
                        <ThemePreviewGrid
                            portfolioData={data as unknown as Partial<IPortfolio>}
                            onSelect={handleThemeSwitch}
                            currentTemplate={data.template}
                        />
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 overflow-hidden">
                    <div className="p-8 sm:p-10">
                        {/* Old Header Removed - replaced by fixed navbar */}

                        <div className="space-y-10">
                            {/* Personal Info */}
                            <section>
                                <h2 className="text-xl font-serif font-bold text-foreground border-b border-slate-200/60 pb-4 mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={data.name || ''}
                                            onChange={e => handleChange('name', e.target.value)}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-serif"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={data.email || ''}
                                            onChange={e => handleChange('email', e.target.value)}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={data.phone || ''}
                                            onChange={e => handleChange('phone', e.target.value)}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Headline</label>
                                        <input
                                            type="text"
                                            value={data.headline || ''}
                                            onChange={e => handleChange('headline', e.target.value)}
                                            placeholder="e.g. Full Stack Developer"
                                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Summary</label>
                                        <textarea
                                            value={data.summary || ''}
                                            onChange={e => handleChange('summary', e.target.value)}
                                            rows={3}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    {/* Profile Picture Upload */}
                                    <div className="md:col-span-2 flex items-center space-x-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">Profile Picture</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="block w-full text-sm text-slate-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-primary/10 file:text-primary
                                                    hover:file:bg-primary/20
                                                    transition-all"
                                            />
                                        </div>
                                        {data.userImage && (
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                                                    <Image
                                                        src={data.userImage}
                                                        alt="Profile"
                                                        fill
                                                        className="object-cover rounded-full"
                                                        unoptimized
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleDeleteImage}
                                                    className="text-destructive hover:text-red-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                                                    type="button"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Skills */}
                            <section>
                                <h2 className="text-xl font-serif font-bold mb-4 text-foreground border-b border-slate-200/60 pb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                                    Skills
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Skills (comma separated)</label>
                                    <textarea
                                        value={data.skills?.join(', ') || ''}
                                        onChange={handleSkillsChange}
                                        rows={3}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-sans"
                                        placeholder="React, Node.js, TypeScript..."
                                    />
                                </div>
                            </section>

                            {/* Experience */}
                            <section>
                                <div className="flex justify-between items-center mb-6 border-b border-slate-200/60 pb-2">
                                    <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                        Experience
                                    </h2>
                                    <button onClick={() => addItem('experience')} className="text-primary hover:text-primary/80 text-sm font-medium hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                                        + Add Experience
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {data.experience?.map((exp, idx) => (
                                        <div key={idx} className="p-6 bg-white/50 border border-slate-200 rounded-xl relative hover:shadow-sm transition-shadow group">
                                            <button
                                                onClick={() => removeItem('experience', idx)}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-destructive p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove Item"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Company"
                                                    value={exp.company}
                                                    onChange={e => handleArrayChange('experience', idx, 'company', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <input
                                                    placeholder="Position"
                                                    value={exp.position}
                                                    onChange={e => handleArrayChange('experience', idx, 'position', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <input
                                                    placeholder="Start Date"
                                                    value={exp.startDate}
                                                    onChange={e => handleArrayChange('experience', idx, 'startDate', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <input
                                                    placeholder="End Date"
                                                    value={exp.endDate}
                                                    onChange={e => handleArrayChange('experience', idx, 'endDate', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <textarea
                                                    placeholder="Description"
                                                    value={exp.description}
                                                    onChange={e => handleArrayChange('experience', idx, 'description', e.target.value)}
                                                    className="md:col-span-2 p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {data.experience?.length === 0 && <p className="text-muted-foreground italic text-center py-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">No experience added yet.</p>}
                                </div>
                            </section>

                            {/* Projects */}
                            <section>
                                <div className="flex justify-between items-center mb-6 border-b border-slate-200/60 pb-2">
                                    <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                                        Projects
                                    </h2>
                                    <button onClick={() => addItem('projects')} className="text-primary hover:text-primary/80 text-sm font-medium hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                                        + Add Project
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {data.projects?.map((proj, idx) => (
                                        <div key={idx} className="p-6 bg-white/50 border border-slate-200 rounded-xl relative hover:shadow-sm transition-shadow group">
                                            <button
                                                onClick={() => removeItem('projects', idx)}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-destructive p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove Item"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-1 gap-4">
                                                <input
                                                    placeholder="Project Name"
                                                    value={proj.name}
                                                    onChange={e => handleArrayChange('projects', idx, 'name', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <input
                                                    placeholder="Link (Optional)"
                                                    value={proj.link}
                                                    onChange={e => handleArrayChange('projects', idx, 'link', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <textarea
                                                    placeholder="Description"
                                                    value={proj.description}
                                                    onChange={e => handleArrayChange('projects', idx, 'description', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {data.projects?.length === 0 && <p className="text-muted-foreground italic text-center py-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">No projects added yet.</p>}
                                </div>
                            </section>

                            {/* Education */}
                            <section>
                                <div className="flex justify-between items-center mb-6 border-b border-slate-200/60 pb-2">
                                    <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                        Education
                                    </h2>
                                    <button onClick={() => addItem('education')} className="text-primary hover:text-primary/80 text-sm font-medium hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                                        + Add Education
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {data.education?.map((edu, idx) => (
                                        <div key={idx} className="p-6 bg-white/50 border border-slate-200 rounded-xl relative hover:shadow-sm transition-shadow group">
                                            <button
                                                onClick={() => removeItem('education', idx)}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-destructive p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove Item"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Institution"
                                                    value={edu.institution}
                                                    onChange={e => handleArrayChange('education', idx, 'institution', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <input
                                                    placeholder="Degree"
                                                    value={edu.degree}
                                                    onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <input
                                                    placeholder="Start Year"
                                                    value={edu.startYear}
                                                    onChange={e => handleArrayChange('education', idx, 'startYear', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                                <input
                                                    placeholder="End Year"
                                                    value={edu.endYear}
                                                    onChange={e => handleArrayChange('education', idx, 'endYear', e.target.value)}
                                                    className="p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {data.education?.length === 0 && <p className="text-muted-foreground italic text-center py-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">No education added yet.</p>}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
