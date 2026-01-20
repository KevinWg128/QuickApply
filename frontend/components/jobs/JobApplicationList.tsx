'use client';

import { JobApplicationCard } from './JobApplicationCard';
import { JobApplicationDialog } from './JobApplicationDialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import type {
    JobApplication,
    JobApplicationInput,
    ApplicationStatus,
    PaginatedResponse,
} from '@/lib/types';

interface JobApplicationListProps {
    data: PaginatedResponse<JobApplication>;
    onCreate: (data: JobApplicationInput) => Promise<void>;
    onUpdate: (
        id: string,
        data: Partial<JobApplicationInput> & { status?: ApplicationStatus }
    ) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export function JobApplicationList({
    data,
    onCreate,
    onUpdate,
    onDelete,
    onPageChange,
    onLimitChange,
}: JobApplicationListProps) {
    const { data: applications, pagination } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Job Applications</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {pagination.total}
                    </span>
                </div>
                <JobApplicationDialog mode="create" onSubmit={onCreate} />
            </div>

            {applications.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                        No job applications yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Start tracking your job applications by clicking the button above.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {applications.map((application) => (
                            <JobApplicationCard
                                key={application.id}
                                application={application}
                                onUpdate={(data) => onUpdate(application.id, data)}
                                onDelete={() => onDelete(application.id)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Show</span>
                            <Select
                                value={pagination.limit.toString()}
                                onValueChange={(value) => onLimitChange(parseInt(value))}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">per page</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onPageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onPageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
