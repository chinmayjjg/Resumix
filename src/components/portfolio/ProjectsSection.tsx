interface Project {
  name: string;
  description?: string;
  url?: string;
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold border-b border-gray-200 pb-2 mb-3">Projects</h2>
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-bold">
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h3>
            {project.description && <p className="text-gray-700 mt-1">{project.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
