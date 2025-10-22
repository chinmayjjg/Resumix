import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';

export default function PortfolioLayout({ portfolio }: { portfolio: any }) {
  return (
    <div className="space-y-10">
      {portfolio.about && <AboutSection about={portfolio.about} />}

      {portfolio.experiences?.length > 0 && (
        <ExperienceSection experiences={portfolio.experiences} />
      )}

      {portfolio.education?.length > 0 && (
        <EducationSection education={portfolio.education} />
      )}

      {portfolio.skills?.length > 0 && <SkillsSection skills={portfolio.skills} />}

      {portfolio.projects?.length > 0 && <ProjectsSection projects={portfolio.projects} />}
    </div>
  );
}
