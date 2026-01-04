"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Settings, FileText, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
    },
    {
        title: "Upload Resume",
        href: "/dashboard/upload",
        icon: FileText,
    },
    {
        title: "Builder",
        href: "/dashboard/builder",
        icon: FileText,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-white/60 backdrop-blur-md border-r border-slate-200/60 w-64 shadow-[1px_0_20px_0px_rgba(0,0,0,0.02)]">
            <div className="p-6 flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-serif font-bold text-foreground">Resumix</h2>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground rounded-xl hover:bg-red-50 hover:text-red-600 w-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
