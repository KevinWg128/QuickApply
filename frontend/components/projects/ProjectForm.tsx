'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Project, ProjectInput } from '@/lib/types';
import { Pencil, Plus } from 'lucide-react';

interface ProjectFormProps {
    project?: Project;
    defaultType?: 'project' | 'award';
    onSubmit: (data: ProjectInput) => Promise<void>;
    trigger?: React.ReactNode;
}

export function ProjectForm({ project, defaultType = 'project', onSubmit, trigger }: ProjectFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ProjectInput>({
        name: '',
        description: '',
        url: '',
        startDate: '',
        endDate: '',
        type: defaultType,
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description || '',
                url: project.url || '',
                startDate: project.startDate?.split('T')[0] || '',
                endDate: project.endDate?.split('T')[0] || '',
                type: project.type,
            });
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            setOpen(false);
            if (!project) {
                setFormData({
                    name: '',
                    description: '',
                    url: '',
                    startDate: '',
                    endDate: '',
                    type: defaultType,
                });
            }
        } catch (error) {
            console.error('Failed to save project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const isAward = formData.type === 'award';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant={project ? 'ghost' : 'outline'}
                        size={project ? 'icon' : 'default'}
                        className={project ? 'h-8 w-8' : 'gap-2'}
                    >
                        {project ? (
                            <Pencil className="h-4 w-4" />
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Add {defaultType === 'award' ? 'Award' : 'Project'}
                            </>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {project ? `Edit ${isAward ? 'Award' : 'Project'}` : `Add ${isAward ? 'Award' : 'Project'}`}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">{isAward ? 'Award' : 'Project'} Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={isAward ? 'Best Innovation Award' : 'My Awesome Project'}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="project">Project</option>
                                <option value="award">Award</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            name="url"
                            type="url"
                            value={formData.url || ''}
                            onChange={handleChange}
                            placeholder={isAward ? 'https://award-link.com' : 'https://github.com/project'}
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">{isAward ? 'Date' : 'Start Date'}</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate || ''}
                                onChange={handleChange}
                            />
                        </div>
                        {!isAward && (
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder={isAward ? 'Describe the award and why you received it...' : 'Describe your project, technologies used, key features...'}
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : project ? 'Save Changes' : `Add ${isAward ? 'Award' : 'Project'}`}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
