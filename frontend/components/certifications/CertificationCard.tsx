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
import { CertificationForm } from './CertificationForm';
import type { Certification, CertificationInput } from '@/lib/types';
import { Award, Calendar, ExternalLink, Trash2 } from 'lucide-react';

interface CertificationCardProps {
    certification: Certification;
    onUpdate: (data: CertificationInput) => Promise<void>;
    onDelete: () => Promise<void>;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function isExpired(expiryDate: string): boolean {
    return new Date(expiryDate) < new Date();
}

export function CertificationCard({ certification, onUpdate, onDelete }: CertificationCardProps) {
    const expired = certification.expiryDate ? isExpired(certification.expiryDate) : false;

    return (
        <Card className="group relative transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                            <Award className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{certification.name}</h3>
                                {expired && (
                                    <Badge variant="destructive" className="text-xs">
                                        Expired
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{certification.issuer}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Issued: {formatDate(certification.issueDate)}
                                    {certification.expiryDate && ` · Expires: ${formatDate(certification.expiryDate)}`}
                                </span>
                                {certification.credentialId && (
                                    <span className="font-mono text-xs">
                                        ID: {certification.credentialId}
                                    </span>
                                )}
                                {certification.credentialUrl && (
                                    <a
                                        href={certification.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-primary hover:underline"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        Verify
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <CertificationForm certification={certification} onSubmit={onUpdate} />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Certification</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete the &quot;{certification.name}&quot; certification? This action cannot be undone.
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
