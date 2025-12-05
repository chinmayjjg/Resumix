import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortfolioLayout({ portfolio }: { portfolio: any }) {
  const { name, headline, email, phone, theme } = portfolio;
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <header className={`py-20 px-6 md:px-12 text-center ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 pb-2">
            {name}
          </h1>
          {headline && (
            <p className={`text-xl md:text-2xl font-light ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              {headline}
            </p>
          )}

          <div className="flex justify-center gap-4 pt-4">
            {email && (
              <a href={`mailto:${email}`} className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                Contact Me
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className={`px-6 py-2 rounded-full border border-current font-medium transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}>
                {phone}
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        {portfolio.summary && <AboutSection about={portfolio.summary} isDark={isDark} />}

        {portfolio.skills?.length > 0 && <SkillsSection skills={portfolio.skills} isDark={isDark} />}

        {portfolio.experience?.length > 0 && (
          <ExperienceSection experiences={portfolio.experience} isDark={isDark} />
        )}

        {portfolio.projects?.length > 0 && <ProjectsSection projects={portfolio.projects} isDark={isDark} />}

        {portfolio.education?.length > 0 && (
          <EducationSection education={portfolio.education} isDark={isDark} />
        )}
      </main>

      <footer className={`py-8 text-center text-sm ${isDark ? 'text-slate-500 border-t border-slate-800' : 'text-gray-400 border-t border-gray-100'}`}>
        <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
