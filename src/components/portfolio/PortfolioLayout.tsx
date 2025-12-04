import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortfolioLayout({ portfolio }: { portfolio: any }) {
  return (
    <div className={`${portfolio.theme || 'light'} min-h-screen bg-background text-foreground`}>
      <div className="space-y-10">
        {portfolio.summary && <AboutSection about={portfolio.summary} />}

        {portfolio.experience?.length > 0 && (
          <ExperienceSection experiences={portfolio.experience} />
        )}

        {portfolio.education?.length > 0 && (
          <EducationSection education={portfolio.education} />
        )}

        {portfolio.skills?.length > 0 && <SkillsSection skills={portfolio.skills} />}

        {portfolio.projects?.length > 0 && <ProjectsSection projects={portfolio.projects} />}
      </div>
    </div>
  );
}
