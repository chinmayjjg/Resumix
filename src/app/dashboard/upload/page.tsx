'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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

      // 2. Map to Portfolio Schema
      const portfolioData = {
        email: parsedData.email,
        phone: parsedData.phone,
        skills: parsedData.skills,
        projects: parsedData.projects?.map((p: any) => ({
          name: p.title,
          description: p.summary,
          link: '' // Default empty link
        })) || [],
        // Initialize other arrays if needed
        experience: [],
        education: []
      };

      // 3. Save to Portfolio
      const saveRes = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData)
      });

      if (!saveRes.ok) throw new Error('Failed to save portfolio data');

      // 4. Redirect to Builder
      router.push('/dashboard/builder');

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-6">Upload Your Resume</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 px-4 rounded-md disabled:bg-gray-400 font-medium hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Processing...' : 'Upload & Create Portfolio'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Upload your PDF resume to automatically extract your details.
      </p>
    </div>
  );
}
