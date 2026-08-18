export type PortfolioSection = 'about' | 'skills' | 'experience' | 'projects' | 'education';

export interface PortfolioDesign {
  accent: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  font: 'sans' | 'serif' | 'mono';
  hero: 'centered' | 'split' | 'minimal';
  radius: 'soft' | 'rounded' | 'sharp';
  sectionOrder: PortfolioSection[];
}

export const defaultPortfolioDesign: PortfolioDesign = {
  accent: '#6d5dfc',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#172033',
  mutedText: '#64748b',
  font: 'sans',
  hero: 'centered',
  radius: 'rounded',
  sectionOrder: ['about', 'experience', 'projects', 'skills', 'education'],
};

export function normalizePortfolioDesign(value: Partial<PortfolioDesign> | undefined): PortfolioDesign {
  const validSections: PortfolioSection[] = ['about', 'skills', 'experience', 'projects', 'education'];
  const order = Array.isArray(value?.sectionOrder)
    ? value.sectionOrder.filter((section): section is PortfolioSection => validSections.includes(section as PortfolioSection))
    : [];

  return {
    ...defaultPortfolioDesign,
    ...value,
    font: value?.font === 'serif' || value?.font === 'mono' ? value.font : 'sans',
    hero: value?.hero === 'split' || value?.hero === 'minimal' ? value.hero : 'centered',
    radius: value?.radius === 'soft' || value?.radius === 'sharp' ? value.radius : 'rounded',
    sectionOrder: [...new Set([...order, ...defaultPortfolioDesign.sectionOrder])],
  };
}
