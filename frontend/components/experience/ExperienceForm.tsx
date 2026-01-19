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
import type { WorkExperience, WorkExperienceInput } from '@/lib/types';
import { Pencil, Plus } from 'lucide-react';

interface ExperienceFormProps {
    experience?: WorkExperience;
    onSubmit: (data: WorkExperienceInput) => Promise<void>;
    trigger?: React.ReactNode;
}

export function ExperienceForm({ experience, onSubmit, trigger }: ExperienceFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<WorkExperienceInput>({
        company: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrent: false,
    });

    useEffect(() => {
        if (experience) {
            setFormData({
                company: experience.company,
                title: experience.title,
                location: experience.location || '',
                startDate: experience.startDate.split('T')[0],
                endDate: experience.endDate?.split('T')[0] || '',
                description: experience.description || '',
                isCurrent: experience.isCurrent,
            });
        }
    }, [experience]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            setOpen(false);
            if (!experience) {
                setFormData({
                    company: '',
                    title: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    isCurrent: false,
                });
            }
        } catch (error) {
            console.error('Failed to save experience:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant={experience ? 'ghost' : 'outline'}
                        size={experience ? 'icon' : 'default'}
                        className={experience ? 'h-8 w-8' : 'gap-2'}
                    >
                        {experience ? (
                            <Pencil className="h-4 w-4" />
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Add Experience
                            </>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {experience ? 'Edit Experience' : 'Add Work Experience'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company *</Label>
                            <Input
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Google"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Software Engineer"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            placeholder="San Francisco, CA"
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={formData.endDate || ''}
                                onChange={handleChange}
                                disabled={formData.isCurrent}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isCurrent"
                            name="isCurrent"
                            checked={formData.isCurrent}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-input"
                        />
                        <Label htmlFor="isCurrent" className="text-sm font-normal">
                            I currently work here
                        </Label>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="Describe your responsibilities and achievements..."
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
                            {loading ? 'Saving...' : experience ? 'Save Changes' : 'Add Experience'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
