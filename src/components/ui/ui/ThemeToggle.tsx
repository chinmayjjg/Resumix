'use client';
import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ currentTheme, userId, onToggle }: { currentTheme: string; userId: string; onToggle?: (theme: string) => void }) {
  const [theme, setTheme] = useState(currentTheme);

  async function handleToggle() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (onToggle) onToggle(newTheme);

    await fetch('/api/portfolio/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newTheme, userId }),
    });
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-muted-foreground hover:text-primary"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
