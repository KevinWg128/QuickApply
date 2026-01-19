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
import { EducationForm } from './EducationForm';
import type { Education, EducationInput } from '@/lib/types';
import { GraduationCap, Calendar, Trash2 } from 'lucide-react';

interface EducationCardProps {
    education: Education;
    onUpdate: (data: EducationInput) => Promise<void>;
    onDelete: () => Promise<void>;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function EducationCard({ education, onUpdate, onDelete }: EducationCardProps) {
    return (
        <Card className="group relative transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                            <GraduationCap className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground">{education.degree}</h3>
                            <p className="text-sm text-muted-foreground">
                                {education.institution}
                                {education.fieldOfStudy && ` · ${education.fieldOfStudy}`}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(education.startDate)} –{' '}
                                    {education.endDate ? formatDate(education.endDate) : 'Present'}
                                </span>
                                {education.gpa && (
                                    <Badge variant="secondary" className="text-xs">
                                        GPA: {education.gpa.toFixed(2)}
                                    </Badge>
                                )}
                            </div>
                            {education.description && (
                                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                    {education.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <EducationForm education={education} onSubmit={onUpdate} />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Education</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this education entry from {education.institution}? This action cannot be undone.
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
