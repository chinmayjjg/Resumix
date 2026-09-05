"use client";

import { FormEvent, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { CalendarDays, LogOut, Mail, User, X } from "lucide-react";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export default function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const controller = new AbortController();
        const fetchProfile = async () => {
            setLoading(true);
            setMessage(null);
            try {
                const response = await fetch("/api/user/profile", { signal: controller.signal });
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                    setName(data.user.name);
                } else {
                    setMessage({ type: "error", text: "Unable to load your profile." });
                }
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    setMessage({ type: "error", text: "Unable to load your profile." });
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchProfile();
        return () => controller.abort();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const handleSave = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                setMessage({ type: "success", text: "Profile updated successfully." });
            } else {
                setMessage({ type: "error", text: data.error || "Unable to save your profile." });
            }
        } catch {
            setMessage({ type: "error", text: "Unable to save your profile." });
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const initials = user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
            <button aria-label="Close profile settings" className="absolute inset-0 cursor-default bg-slate-950/35 backdrop-blur-md" onClick={onClose} />
            <section className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl dark:border-white/10 dark:bg-[#11182a]/90">
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-400/25 blur-3xl" />
                <div className="relative border-b border-slate-200/80 px-6 py-5 dark:border-white/10 sm:px-8">
                    <button onClick={onClose} className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/10" aria-label="Close">
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-4 pr-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25">{initials}</div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[.18em] text-violet-600 dark:text-violet-300">Account</p>
                            <h2 id="profile-modal-title" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Profile settings</h2>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="relative space-y-5 p-6 sm:p-8">
                    {message && <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300" : "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"}`}>{message.text}</div>}
                    {loading ? <div className="py-12 text-center text-sm text-muted-foreground">Loading your profile…</div> : <>
                        <label className="block">
                            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><User className="h-4 w-4 text-primary" />Full name</span>
                            <input value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-foreground outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-black/15" />
                        </label>
                        <div>
                            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Mail className="h-4 w-4 text-primary" />Email address</span>
                            <div className="rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-black/20">{user?.email}</div>
                        </div>
                        <div>
                            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><CalendarDays className="h-4 w-4 text-primary" />Member since</span>
                            <div className="rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-black/20">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
                        </div>
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                            <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-400/10"><LogOut className="h-4 w-4" />Sign out</button>
                            <button type="submit" disabled={saving || name === user?.name} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>
                        </div>
                    </>}
                </form>
            </section>
        </div>
    );
}
