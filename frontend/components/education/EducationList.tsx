'use client';

import { EducationCard } from './EducationCard';
import { EducationForm } from './EducationForm';
import type { Education, EducationInput } from '@/lib/types';
import { GraduationCap } from 'lucide-react';

interface EducationListProps {
    educations: Education[];
    onCreate: (data: EducationInput) => Promise<void>;
    onUpdate: (id: string, data: EducationInput) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function EducationList({ educations, onCreate, onUpdate, onDelete }: EducationListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Education</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {educations.length}
                    </span>
                </div>
                <EducationForm onSubmit={onCreate} />
            </div>
            {educations.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        No education added yet
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {educations.map((edu) => (
                        <EducationCard
                            key={edu.id}
                            education={edu}
                            onUpdate={(data) => onUpdate(edu.id, data)}
                            onDelete={() => onDelete(edu.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
