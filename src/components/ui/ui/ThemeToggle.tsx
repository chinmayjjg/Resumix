'use client';
import { useState } from 'react';

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
      className="p-2 border rounded"
    >
      Theme: {theme}
    </button>
  );
}
