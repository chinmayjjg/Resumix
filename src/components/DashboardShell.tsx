"use client";

import { createContext, useContext, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProfileModal from "@/components/ProfileModal";

const ProfileModalContext = createContext<(() => void) | null>(null);

export function useProfileModal() {
    const openProfile = useContext(ProfileModalContext);
    if (!openProfile) throw new Error("useProfileModal must be used inside DashboardShell");
    return openProfile;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    return <ProfileModalContext.Provider value={() => setIsProfileOpen(true)}>
        <div className="relative flex h-screen overflow-hidden bg-slate-50 dark:bg-[#090d1a]">
            <Sidebar onOpenProfile={() => setIsProfileOpen(true)} />
            <div className="relative flex-1 overflow-y-auto"><div className="relative min-h-full p-5 md:p-8">{children}</div></div>
        </div>
        <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </ProfileModalContext.Provider>;
}
