"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react";
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

    // Hide navbar on public portfolio pages, builder page, and dashboard
    if (pathname?.startsWith('/portfolio/') || pathname?.startsWith('/u/') || pathname?.startsWith('/dashboard')) {
        return null;
    }

    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <nav className="fixed w-full top-0 z-50 bg-[#f6f5f3] transition-all duration-300 pointer-events-auto shadow-none border-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    {/* Logo (Left) */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-3xl font-serif font-bold text-foreground">
                                Resumix
                            </span>
                        </Link>
                    </div>

                    {/* Center Links */}
                    <div className="hidden md:flex flex-1 justify-center space-x-12">
                        <Link href="#themes" className="text-sm font-medium text-slate-500 hover:text-foreground transition-colors">
                            Themes
                        </Link>
                        <Link href="#features" className="text-sm font-medium text-slate-500 hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium text-slate-500 hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                    </div>

                    {/* Right Side Auth */}
                    <div className="flex-1 flex justify-end items-center gap-6">
                        {session ? (
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-slate-500 hover:text-foreground transition-colors"
                                >
                                    Dashboard
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full border border-slate-200 hover:bg-white transition-all duration-200 group"
                                    >
                                        <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold overflow-hidden">
                                            {session.user?.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt="User"
                                                    fill
                                                    sizes="32px"
                                                    className="object-cover"
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
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                                            <div className="p-4 border-b border-slate-50 tracking-tight">
                                                <p className="text-sm font-semibold text-foreground truncate">
                                                    {session.user?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/dashboard/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    My Profile
                                                </Link>
                                                <button
                                                    onClick={() => signOut()}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                            <div className="hidden sm:flex items-center gap-6">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-foreground hover:text-black transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-black text-white hover:bg-black/90 px-6 py-2.5 rounded-sm text-sm font-medium transition-all"
                                >
                                    Build My Resume
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-slate-600"
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
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden absolute w-full bg-[#f6f5f3] border-b border-gray-200 shadow-sm">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link href="#themes" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-foreground">Themes</Link>
                        <Link href="#features" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-foreground">Features</Link>
                        <Link href="#pricing" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-foreground">Pricing</Link>
                        
                        {!session && (
                            <>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-foreground">Login</Link>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-white bg-black text-center mt-2">Build My Resume</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
