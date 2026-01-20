'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import type { JobApplicationInput, JobApplication } from '@/lib/types';

interface JobApplicationDialogProps {
    mode: 'create' | 'edit';
    application?: JobApplication;
    onSubmit: (data: JobApplicationInput) => Promise<void>;
    trigger?: React.ReactNode;
}

export function JobApplicationDialog({
    mode,
    application,
    onSubmit,
    trigger,
}: JobApplicationDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<JobApplicationInput>({
        jobTitle: application?.jobTitle || '',
        company: application?.company || '',
        jobUrl: application?.jobUrl || '',
        jobDescription: application?.jobDescription || '',
        notes: application?.notes || '',
        appliedAt: application?.appliedAt
            ? new Date(application.appliedAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            setOpen(false);
            if (mode === 'create') {
                setFormData({
                    jobTitle: '',
                    company: '',
                    jobUrl: '',
                    jobDescription: '',
                    notes: '',
                    appliedAt: new Date().toISOString().split('T')[0],
                });
            }
        } catch (error) {
            console.error('Failed to submit job application:', error);
        } finally {
            setLoading(false);
        }
    };

    const defaultTrigger = (
        <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Application
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Add Job Application' : 'Edit Job Application'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Track a new job application you\'ve submitted.'
                            : 'Update the details of your job application.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title *</Label>
                            <Input
                                id="jobTitle"
                                value={formData.jobTitle}
                                onChange={(e) =>
                                    setFormData({ ...formData, jobTitle: e.target.value })
                                }
                                placeholder="Software Engineer"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company *</Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) =>
                                    setFormData({ ...formData, company: e.target.value })
                                }
                                placeholder="Google"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jobUrl">Job URL</Label>
                            <Input
                                id="jobUrl"
                                type="url"
                                value={formData.jobUrl || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, jobUrl: e.target.value })
                                }
                                placeholder="https://careers.google.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appliedAt">Applied Date</Label>
                            <Input
                                id="appliedAt"
                                type="date"
                                value={formData.appliedAt || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, appliedAt: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jobDescription">Job Description</Label>
                        <Textarea
                            id="jobDescription"
                            value={formData.jobDescription || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, jobDescription: e.target.value })
                            }
                            placeholder="Paste the job description here..."
                            rows={4}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            }
                            placeholder="Any notes about the application..."
                            rows={2}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === 'create' ? 'Add Application' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
