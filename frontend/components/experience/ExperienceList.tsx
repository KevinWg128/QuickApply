'use client';

import { ExperienceCard } from './ExperienceCard';
import { ExperienceForm } from './ExperienceForm';
import type { WorkExperience, WorkExperienceInput } from '@/lib/types';
import { Briefcase } from 'lucide-react';

interface ExperienceListProps {
    experiences: WorkExperience[];
    onCreate: (data: WorkExperienceInput) => Promise<void>;
    onUpdate: (id: string, data: WorkExperienceInput) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function ExperienceList({ experiences, onCreate, onUpdate, onDelete }: ExperienceListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Work Experience</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {experiences.length}
                    </span>
                </div>
                <ExperienceForm onSubmit={onCreate} />
            </div>
            {experiences.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        No work experience added yet
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {experiences.map((exp) => (
                        <ExperienceCard
                            key={exp.id}
                            experience={exp}
                            onUpdate={(data) => onUpdate(exp.id, data)}
                            onDelete={() => onDelete(exp.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
