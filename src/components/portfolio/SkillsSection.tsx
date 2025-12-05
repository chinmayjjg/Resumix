export default function SkillsSection({ skills, isDark }: { skills: string[]; isDark: boolean }) {
  return (
    <section>
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Skills</h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${isDark
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'bg-white text-blue-600 border border-gray-200 shadow-sm'
              }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
