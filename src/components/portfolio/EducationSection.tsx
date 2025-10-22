interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
}

export default function EducationSection({ education }: { education: Education[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold border-b border-gray-200 pb-2 mb-3">Education</h2>
      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-bold">{edu.degree}</h3>
            <p className="text-gray-600">{edu.institution}</p>
            <p className="text-sm text-gray-500">
              {edu.startDate} – {edu.endDate || 'Present'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
