'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');

            if (res.status === 401) {
                router.push('/auth/login');
                return;
            }

            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                setName(data.user.name);
            } else {
                setMessage({ type: 'error', text: 'Failed to load profile' });
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
            setMessage({ type: 'error', text: 'Error loading profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (err) {
            console.error('Error updating profile', err);
            setMessage({ type: 'error', text: 'Error updating profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>

                        {message && (
                            <div
                                className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Member Since
                                </label>
                                <input
                                    type="text"
                                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                                    disabled
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving || name === user?.name}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
