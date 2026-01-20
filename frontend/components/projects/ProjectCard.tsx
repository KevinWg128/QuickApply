'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ProjectForm } from './ProjectForm';
import type { Project, ProjectInput } from '@/lib/types';
import { FolderGit2, Trophy, ExternalLink, Calendar, Trash2 } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
    onUpdate: (data: ProjectInput) => Promise<void>;
    onDelete: () => Promise<void>;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
    const isAward = project.type === 'award';
    const Icon = isAward ? Trophy : FolderGit2;
    const iconColor = isAward ? 'text-amber-500' : 'text-green-500';
    const bgColor = isAward ? 'bg-amber-500/10' : 'bg-green-500/10';

    return (
        <Card className="group relative transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${bgColor}`}>
                            <Icon className={`h-6 w-6 ${iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{project.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                    {isAward ? 'Award' : 'Project'}
                                </Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                {project.startDate && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(project.startDate)}
                                        {!isAward && project.endDate && ` – ${formatDate(project.endDate)}`}
                                    </span>
                                )}
                                {project.url && (
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-primary hover:underline"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        View
                                    </a>
                                )}
                            </div>
                            {project.description && (
                                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                    {project.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <ProjectForm project={project} onSubmit={onUpdate} />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete {isAward ? 'Award' : 'Project'}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete &quot;{project.name}&quot;? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
