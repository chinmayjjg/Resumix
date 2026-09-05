import { redirect } from "next/navigation";

// Profile editing now lives in the dashboard modal. Preserve old bookmarks without
// keeping a separate profile screen.
export default function ProfilePage() {
    redirect("/dashboard");
}
