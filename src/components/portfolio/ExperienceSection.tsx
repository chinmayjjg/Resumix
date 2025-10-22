interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  summary?: string;
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold border-b border-gray-200 pb-2 mb-3">Experience</h2>
      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-bold">{exp.position}</h3>
            <p className="text-gray-600">{exp.company}</p>
            <p className="text-sm text-gray-500">
              {exp.startDate} – {exp.endDate || 'Present'}
            </p>
            {exp.summary && <p className="mt-1 text-gray-700">{exp.summary}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
