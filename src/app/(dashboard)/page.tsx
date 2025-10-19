'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Upload a PDF first');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    setData(json.parsedData || json);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded-md disabled:bg-gray-400"
        >
          {loading ? 'Parsing...' : 'Upload Resume'}
        </button>
      </form>

      {data && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
