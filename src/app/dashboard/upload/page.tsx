'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemePreviewGrid from '@/components/portfolio/ThemePreviewGrid';
import { IPortfolio } from '@/models/Portfolio';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedPortfolio, setParsedPortfolio] = useState<Partial<IPortfolio> | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Upload a PDF first');
    setLoading(true);

    try {
      // 1. Upload and Parse
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadJson.error || 'Upload failed');

      const { parsedData } = uploadJson;

      // Map to Portfolio Schema (Partial)
      const portfolioData: Partial<IPortfolio> = {
        name: parsedData.name || 'User',
        email: parsedData.email,
        phone: parsedData.phone,
        skills: parsedData.skills,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects: parsedData.projects?.map((p: any) => ({
          name: p.title,
          description: p.summary,
          link: '' // Default empty link
        })) || [],
        experience: [], // Resume parser might not fill this yet
        education: []
      };

      setParsedPortfolio(portfolioData);
      setStep('preview');
    } catch (err) {
      console.error(err);
      alert('Error uploading resume');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = async (templateId: string) => {
    if (!parsedPortfolio) return;
    setLoading(true);

    const finalPortfolio = { ...parsedPortfolio, template: templateId };

    try {
      const res = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPortfolio)
      });

      if (!res.ok) throw new Error('Failed to save');
      router.push('/dashboard/builder');
    } catch (error) {
      console.error(error);
      alert('Failed to save selection');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {step === 'upload' ? 'Upload Your Resume' : 'Choose Your Style'}
      </h1>

      {step === 'upload' ? (
        <form onSubmit={handleUpload} className="max-w-xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <div>
            <label className="block text-sm font-medium mb-2">Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Upload & Continue'}
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800">
            <p>Here is a preview of your portfolio in different styles. Select one to continue editing.</p>
            <button onClick={() => setStep('upload')} className="text-sm underline hover:text-blue-600">
              Upload Different Resume
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500">Saving Selection...</div>
          ) : (
            <ThemePreviewGrid
              portfolioData={parsedPortfolio || {}}
              onSelect={handleThemeSelect}
            />
          )}
        </div>
      )}
    </div>
  );
}
