'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import type { Project, ProjectInput } from '@/lib/types';
import { FolderGit2, Trophy } from 'lucide-react';

interface ProjectsListProps {
    projects: Project[];
    onCreate: (data: ProjectInput) => Promise<void>;
    onUpdate: (id: string, data: ProjectInput) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function ProjectsList({ projects, onCreate, onUpdate, onDelete }: ProjectsListProps) {
    const { projectItems, awardItems } = useMemo(() => {
        return {
            projectItems: projects.filter((p) => p.type === 'project'),
            awardItems: projects.filter((p) => p.type === 'award'),
        };
    }, [projects]);

    const renderList = (items: Project[], type: 'project' | 'award') => {
        if (items.length === 0) {
            const Icon = type === 'award' ? Trophy : FolderGit2;
            return (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <Icon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        No {type === 'award' ? 'awards' : 'projects'} added yet
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {items.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onUpdate={(data) => onUpdate(project.id, data)}
                        onDelete={() => onDelete(project.id)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Projects & Awards</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {projects.length}
                    </span>
                </div>
            </div>
            <Tabs defaultValue="projects" className="w-full">
                <div className="flex items-center justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="projects" className="gap-2">
                            <FolderGit2 className="h-4 w-4" />
                            Projects ({projectItems.length})
                        </TabsTrigger>
                        <TabsTrigger value="awards" className="gap-2">
                            <Trophy className="h-4 w-4" />
                            Awards ({awardItems.length})
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="projects" className="mt-4 space-y-4">
                    <div className="flex justify-end">
                        <ProjectForm defaultType="project" onSubmit={onCreate} />
                    </div>
                    {renderList(projectItems, 'project')}
                </TabsContent>
                <TabsContent value="awards" className="mt-4 space-y-4">
                    <div className="flex justify-end">
                        <ProjectForm defaultType="award" onSubmit={onCreate} />
                    </div>
                    {renderList(awardItems, 'award')}
                </TabsContent>
            </Tabs>
        </div>
    );
}
