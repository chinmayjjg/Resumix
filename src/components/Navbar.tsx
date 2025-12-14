"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard, User, ChevronDown, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hide navbar on public portfolio pages and builder page
    if (pathname?.startsWith('/portfolio/') || pathname?.startsWith('/u/') || pathname === '/dashboard/builder') {
        return null;
    }

    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <nav className="fixed w-full top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-lg text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                            Resumix
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex sm:items-center sm:gap-8">
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                        >
                            Home
                        </Link>

                        {session ? (
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/builder"
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                                >
                                    Builder
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                                            {session.user?.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt="User"
                                                    fill
                                                    sizes="32px"
                                                    className="rounded-full object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                userInitials
                                            )}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                    {session.user?.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-blue-500" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/dashboard/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-purple-500" />
                                                    My Profile
                                                </Link>
                                                {/* Divider */}
                                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                                                <button
                                                    onClick={() => signOut()}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden absolute w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-5">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
                        >
                            Home
                        </Link>
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/builder"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
                                >
                                    Builder
                                </Link>
                                <Link
                                    href="/dashboard/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
                                >
                                    Profile
                                </Link>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                                    <div className="flex items-center px-4 gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                                            {userInitials}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-white">{session.user?.name}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">{session.user?.email}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 dark:bg-red-900/10 rounded-lg font-medium"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
