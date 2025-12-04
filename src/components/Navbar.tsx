"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">Resumix</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Home
                        </Link>
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <div className="relative ml-3">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-700">
                                            {session.user?.name}
                                        </span>
                                        <button
                                            onClick={() => signOut()}
                                            className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Sign Out"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
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
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <div className="pl-3 pr-4 py-2 border-l-4 border-transparent">
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-medium text-gray-500">
                                            {session.user?.name}
                                        </span>
                                        <button
                                            onClick={() => signOut()}
                                            className="text-gray-500 hover:text-red-600"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                onClick={() => setIsMenuOpen(false)}
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
