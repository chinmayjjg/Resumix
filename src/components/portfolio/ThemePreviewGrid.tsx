import React from 'react';
import { IPortfolio } from '@/models/Portfolio';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import TechTemplate from './templates/TechTemplate';
import CuteTemplate from './templates/CuteTemplate';

interface ThemePreviewGridProps {
    portfolioData: Partial<IPortfolio>;
    onSelect: (template: string) => void;
    currentTemplate?: string;
}

const TEMPLATES = [
    { id: 'modern', name: 'Modern', component: ModernTemplate },
    { id: 'minimal', name: 'Minimal', component: MinimalTemplate },
    { id: 'professional', name: 'Professional', component: ProfessionalTemplate },
    { id: 'creative', name: 'Creative', component: CreativeTemplate },
    { id: 'tech', name: 'Tech', component: TechTemplate },
    { id: 'cute', name: 'Cute Cat', component: CuteTemplate },
];

export default function ThemePreviewGrid({ portfolioData, onSelect, currentTemplate }: ThemePreviewGridProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {TEMPLATES.map((template) => {
                const Component = template.component;
                const isSelected = currentTemplate === template.id;

                return (
                    <div
                        key={template.id}
                        className={`group relative rounded-xl border-4 overflow-hidden transition-all duration-300 ${isSelected ? 'border-blue-600 ring-4 ring-blue-600/20 scale-105 z-10' : 'border-transparent hover:border-slate-300 hover:shadow-2xl'}`}
                    >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/80 to-transparent text-white flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="font-bold">{template.name}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onSelect(template.id); }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full"
                            >
                                Select
                            </button>
                        </div>

                        {/* Preview Container - Scaled Down */}
                        <div
                            className="relative w-full aspect-[9/16] md:aspect-square lg:aspect-[3/4] bg-slate-100 overflow-hidden cursor-pointer"
                            onClick={() => onSelect(template.id)}
                        >
                            {/* 
                   Scale Transform: 
                   We render the full component but scale it down to fit the card.
                   The container is fixed size, but the content thinks it's full screen.
                */}
                            <div className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left transform scale-[0.25] pointer-events-none select-none">
                                <Component portfolio={{ ...portfolioData, template: template.id as IPortfolio['template'] }} />
                            </div>

                            {/* Overlay to prevent interaction with iframe content but allow click to select */}
                            <div className="absolute inset-0 bg-transparent z-10"></div>
                        </div>

                        {/* Active Label */}
                        {isSelected && (
                            <div className="absolute bottom-4 right-4 z-20 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                Active
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
