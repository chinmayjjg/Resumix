'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
};

export default function BuilderPage() {
    const [data, setData] = useState<PortfolioData>(initialData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await fetch('/api/portfolio/me');
            const json = await res.json();
            if (json.portfolio) {
                // Merge with initialData to ensure all arrays exist
                setData({ ...initialData, ...json.portfolio });
            }
        } catch (err) {
            console.error('Failed to fetch portfolio', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof PortfolioData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: 'experience' | 'education' | 'projects', index: number, subField: string, value: string) => {
        const newArray = [...data[field]] as any[];
        newArray[index][subField] = value;
        setData(prev => ({ ...prev, [field]: newArray }));
    };

    const addItem = (field: 'experience' | 'education' | 'projects') => {
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

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Portfolio Builder</h1>
                        <div className="space-x-4 flex items-center">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            {data.userId && (
                                <a
                                    href={`/portfolio/${data.userId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    View Live
                                </a>
                            )}
                            <button
                                onClick={savePortfolio}
                                disabled={saving}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Personal Info */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name || ''}
                                        onChange={e => handleChange('name', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.email || ''}
                                        onChange={e => handleChange('email', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={data.phone || ''}
                                        onChange={e => handleChange('phone', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                                    <input
                                        type="text"
                                        value={data.headline || ''}
                                        onChange={e => handleChange('headline', e.target.value)}
                                        placeholder="e.g. Full Stack Developer"
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                                    <textarea
                                        value={data.summary || ''}
                                        onChange={e => handleChange('summary', e.target.value)}
                                        rows={3}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Skills */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Skills</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                                <textarea
                                    value={data.skills?.join(', ') || ''}
                                    onChange={handleSkillsChange}
                                    rows={3}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="React, Node.js, TypeScript..."
                                />
                            </div>
                        </section>

                        {/* Experience */}
                        <section>
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
                                <button onClick={() => addItem('experience')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add Experience</button>
                            </div>
                            <div className="space-y-6">
                                {data.experience?.map((exp, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 border rounded-lg relative">
                                        <button
                                            onClick={() => removeItem('experience', idx)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                placeholder="Company"
                                                value={exp.company}
                                                onChange={e => handleArrayChange('experience', idx, 'company', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                placeholder="Position"
                                                value={exp.position}
                                                onChange={e => handleArrayChange('experience', idx, 'position', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                placeholder="Start Date"
                                                value={exp.startDate}
                                                onChange={e => handleArrayChange('experience', idx, 'startDate', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                placeholder="End Date"
                                                value={exp.endDate}
                                                onChange={e => handleArrayChange('experience', idx, 'endDate', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={exp.description}
                                                onChange={e => handleArrayChange('experience', idx, 'description', e.target.value)}
                                                className="md:col-span-2 p-2 border rounded-md"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {data.experience?.length === 0 && <p className="text-gray-500 italic">No experience added yet.</p>}
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
                                <button onClick={() => addItem('projects')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add Project</button>
                            </div>
                            <div className="space-y-6">
                                {data.projects?.map((proj, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 border rounded-lg relative">
                                        <button
                                            onClick={() => removeItem('projects', idx)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-1 gap-4">
                                            <input
                                                placeholder="Project Name"
                                                value={proj.name}
                                                onChange={e => handleArrayChange('projects', idx, 'name', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                placeholder="Link (Optional)"
                                                value={proj.link}
                                                onChange={e => handleArrayChange('projects', idx, 'link', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={proj.description}
                                                onChange={e => handleArrayChange('projects', idx, 'description', e.target.value)}
                                                className="p-2 border rounded-md"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {data.projects?.length === 0 && <p className="text-gray-500 italic">No projects added yet.</p>}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="text-xl font-semibold text-gray-800">Education</h2>
                                <button onClick={() => addItem('education')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add Education</button>
                            </div>
                            <div className="space-y-6">
                                {data.education?.map((edu, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 border rounded-lg relative">
                                        <button
                                            onClick={() => removeItem('education', idx)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                placeholder="Institution"
                                                value={edu.institution}
                                                onChange={e => handleArrayChange('education', idx, 'institution', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                placeholder="Degree"
                                                value={edu.degree}
                                                onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                placeholder="Start Year"
                                                value={edu.startYear}
                                                onChange={e => handleArrayChange('education', idx, 'startYear', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                placeholder="End Year"
                                                value={edu.endYear}
                                                onChange={e => handleArrayChange('education', idx, 'endYear', e.target.value)}
                                                className="p-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {data.education?.length === 0 && <p className="text-gray-500 italic">No education added yet.</p>}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
