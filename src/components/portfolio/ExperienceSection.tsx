interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  summary?: string;
}

export default function ExperienceSection({ experiences, isDark }: { experiences: Experience[]; isDark: boolean }) {
  return (
    <section>
      <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Experience</h2>
      <div className="relative border-l-2 border-gray-200 ml-3 space-y-12">
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative pl-8">
            {/* Timeline dot */}
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 ${isDark ? 'bg-slate-900 border-blue-500' : 'bg-white border-blue-600'}`}></div>

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
              <h3 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{exp.position}</h3>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                {exp.startDate} – {exp.endDate || 'Present'}
              </span>
            </div>

            <p className={`text-lg font-medium mb-3 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
              {exp.company}
            </p>

            {(exp.description || exp.summary) && (
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                {exp.description || exp.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
