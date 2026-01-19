'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Skill } from '@/lib/types';
import { X } from 'lucide-react';

interface SkillBadgeProps {
    skill: Skill;
    onDelete: () => Promise<void>;
}

const proficiencyColors: Record<string, string> = {
    Beginner: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 hover:bg-slate-500/20',
    Intermediate: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20',
    Advanced: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20',
    Expert: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20',
};

export function SkillBadge({ skill, onDelete }: SkillBadgeProps) {
    const colorClass = skill.proficiency
        ? proficiencyColors[skill.proficiency] || 'bg-muted'
        : 'bg-muted hover:bg-muted/80';

    return (
        <Badge
            variant="secondary"
            className={`group gap-1 py-1.5 pl-3 pr-1.5 text-sm transition-colors ${colorClass}`}
        >
            <span>{skill.name}</span>
            {skill.proficiency && (
                <span className="ml-1 text-xs opacity-60">· {skill.proficiency}</span>
            )}
            <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/20"
                onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                }}
            >
                <X className="h-3 w-3" />
            </Button>
        </Badge>
    );
}
