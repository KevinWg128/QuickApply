'use client';

import { useMemo } from 'react';
import { SkillBadge } from './SkillBadge';
import { SkillForm } from './SkillForm';
import type { Skill, SkillInput } from '@/lib/types';
import { Wrench } from 'lucide-react';

interface SkillsListProps {
    skills: Skill[];
    onCreate: (data: SkillInput) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function SkillsList({ skills, onCreate, onDelete }: SkillsListProps) {
    const groupedSkills = useMemo(() => {
        const groups: Record<string, Skill[]> = {};

        skills.forEach((skill) => {
            const category = skill.category || 'Other';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(skill);
        });

        return Object.entries(groups).sort(([a], [b]) => {
            if (a === 'Other') return 1;
            if (b === 'Other') return -1;
            return a.localeCompare(b);
        });
    }, [skills]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Skills</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {skills.length}
                    </span>
                </div>
                <SkillForm onSubmit={onCreate} />
            </div>
            {skills.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <Wrench className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        No skills added yet
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {groupedSkills.map(([category, categorySkills]) => (
                        <div key={category} className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categorySkills.map((skill) => (
                                    <SkillBadge
                                        key={skill.id}
                                        skill={skill}
                                        onDelete={() => onDelete(skill.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
