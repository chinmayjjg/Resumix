export default function SkillsSection({ skills }: { skills: string[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold border-b border-gray-200 pb-2 mb-3">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border border-gray-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
