import React from 'react';

const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and balanced design', color: 'bg-blue-500' },
    { id: 'minimal', name: 'Minimal', description: 'Simple, focus on content', color: 'bg-gray-200' },
    { id: 'professional', name: 'Professional', description: 'Corporate and structured', color: 'bg-indigo-600' },
    { id: 'creative', name: 'Creative', description: 'Bold and artistic', color: 'bg-pink-500' },
    { id: 'tech', name: 'Tech', description: 'Dark terminal style', color: 'bg-slate-900' },
];

interface TemplateSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Choose a Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        type="button"
                        onClick={() => onChange(template.id)}
                        className={`
              relative flex flex-col items-start p-4 rounded-lg border-2 text-left transition-all
              ${value === template.id
                                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
            `}
                    >
                        <div className={`w-full h-24 rounded-md mb-3 ${template.color} opacity-20`} />
                        <span className="font-semibold text-gray-900">{template.name}</span>
                        <span className="text-xs text-gray-500 mt-1">{template.description}</span>

                        {value === template.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
