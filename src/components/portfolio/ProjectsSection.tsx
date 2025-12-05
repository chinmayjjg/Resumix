interface Project {
  name: string;
  description?: string;
  url?: string;
  link?: string; // Handle both potential property names
}

export default function ProjectsSection({ projects, isDark }: { projects: Project[]; isDark: boolean }) {
  return (
    <section>
      <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, idx) => {
          const projectLink = project.url || project.link;

          return (
            <div
              key={idx}
              className={`group p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border ${isDark
                  ? 'bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:shadow-blue-900/20'
                  : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-blue-100'
                }`}
            >
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                {project.name}
              </h3>

              {project.description && (
                <p className={`mb-4 line-clamp-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {project.description}
                </p>
              )}

              {projectLink && (
                <a
                  href={projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center font-medium transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                >
                  View Project <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
