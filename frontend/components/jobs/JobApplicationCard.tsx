'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { JobApplicationDialog } from './JobApplicationDialog';
import { TailoredResumeDialog } from '@/components/tailor/TailoredResumeDialog';
import {
    ExternalLink,
    MoreHorizontal,
    Pencil,
    Trash2,
    Calendar,
    Building2,
    Briefcase,
    FileText,
} from 'lucide-react';
import type { JobApplication, JobApplicationInput, ApplicationStatus } from '@/lib/types';

interface JobApplicationCardProps {
    application: JobApplication;
    onUpdate: (data: Partial<JobApplicationInput> & { status?: ApplicationStatus }) => Promise<void>;
    onDelete: () => Promise<void>;
}

const STATUS_CONFIG: Record<
    ApplicationStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
    APPLIED: { label: 'Applied', variant: 'secondary' },
    INTERVIEW: { label: 'Interview', variant: 'default' },
    OFFER: { label: 'Offer', variant: 'default' },
    REJECTED: { label: 'Rejected', variant: 'destructive' },
    WITHDRAWN: { label: 'Withdrawn', variant: 'outline' },
};

export function JobApplicationCard({
    application,
    onUpdate,
    onDelete,
}: JobApplicationCardProps) {
    const [deleting, setDeleting] = useState(false);

    const handleStatusChange = async (status: ApplicationStatus) => {
        await onUpdate({ status });
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete();
        } catch (error) {
            console.error('Failed to delete application:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = async (data: JobApplicationInput) => {
        await onUpdate(data);
    };

    const statusConfig = STATUS_CONFIG[application.status];

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <h3 className="font-semibold text-lg truncate">
                                {application.jobTitle}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{application.company}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={application.status}
                            onValueChange={(value) =>
                                handleStatusChange(value as ApplicationStatus)
                            }
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue>
                                    <Badge variant={statusConfig.variant}>
                                        {statusConfig.label}
                                    </Badge>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                                    <SelectItem key={status} value={status}>
                                        <Badge variant={config.variant}>{config.label}</Badge>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <TailoredResumeDialog
                            application={application}
                            trigger={
                                <Button variant="outline" size="icon" title="Tailor Resume">
                                    <FileText className="h-4 w-4" />
                                </Button>
                            }
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <JobApplicationDialog
                                    mode="edit"
                                    application={application}
                                    onSubmit={handleEdit}
                                    trigger={
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                    }
                                />
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(application.appliedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                timeZone: 'UTC',
                            })}
                        </span>
                    </div>
                    {application.jobUrl && (
                        <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Job</span>
                        </a>
                    )}
                </div>
                {application.notes && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {application.notes}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
