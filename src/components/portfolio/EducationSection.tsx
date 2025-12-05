interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  startYear?: string;
  endYear?: string;
}

export default function EducationSection({ education, isDark }: { education: Education[]; isDark: boolean }) {
  return (
    <section>
      <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Education</h2>
      <div className="space-y-6">
        {education.map((edu, idx) => {
          const start = edu.startDate || edu.startYear;
          const end = edu.endDate || edu.endYear;

          return (
            <div
              key={idx}
              className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border-b ${isDark ? 'border-slate-800' : 'border-gray-100'
                }`}
            >
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{edu.institution}</h3>
                <p className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{edu.degree}</p>
              </div>
              <div className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-600'
                }`}>
                {start} – {end || 'Present'}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
