import dynamic from 'next/dynamic';

const ModernTemplate = dynamic(() => import('./templates/ModernTemplate'));
const MinimalTemplate = dynamic(() => import('./templates/MinimalTemplate'));
const ProfessionalTemplate = dynamic(() => import('./templates/ProfessionalTemplate'));
const CreativeTemplate = dynamic(() => import('./templates/CreativeTemplate'));
const TechTemplate = dynamic(() => import('./templates/TechTemplate'));
const CuteTemplate = dynamic(() => import('./templates/CuteTemplate'));


import { IPortfolio } from '@/models/Portfolio';

export default function PortfolioLayout({ portfolio }: { portfolio: IPortfolio }) {
  const template = portfolio.template || 'modern';

  switch (template) {
    case 'minimal':
      return <MinimalTemplate portfolio={portfolio} />;
    case 'professional':
      return <ProfessionalTemplate portfolio={portfolio} />;
    case 'creative':
      return <CreativeTemplate portfolio={portfolio} />;
    case 'tech':
      return <TechTemplate portfolio={portfolio} />;
    case 'cute':
      return <CuteTemplate portfolio={portfolio} />;
    case 'modern':
    default:
      return <ModernTemplate portfolio={portfolio} />;
  }
}
