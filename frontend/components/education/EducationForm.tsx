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
import type { Education, EducationInput } from '@/lib/types';
import { Pencil, Plus } from 'lucide-react';

interface EducationFormProps {
    education?: Education;
    onSubmit: (data: EducationInput) => Promise<void>;
    trigger?: React.ReactNode;
}

export function EducationForm({ education, onSubmit, trigger }: EducationFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<EducationInput>({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: undefined,
        description: '',
    });

    useEffect(() => {
        if (education) {
            setFormData({
                institution: education.institution,
                degree: education.degree,
                fieldOfStudy: education.fieldOfStudy || '',
                startDate: education.startDate.split('T')[0],
                endDate: education.endDate?.split('T')[0] || '',
                gpa: education.gpa ?? undefined,
                description: education.description || '',
            });
        }
    }, [education]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                gpa: formData.gpa ? Number(formData.gpa) : undefined,
            });
            setOpen(false);
            if (!education) {
                setFormData({
                    institution: '',
                    degree: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    gpa: undefined,
                    description: '',
                });
            }
        } catch (error) {
            console.error('Failed to save education:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'gpa' && value ? parseFloat(value) : value,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant={education ? 'ghost' : 'outline'}
                        size={education ? 'icon' : 'default'}
                        className={education ? 'h-8 w-8' : 'gap-2'}
                    >
                        {education ? (
                            <Pencil className="h-4 w-4" />
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Add Education
                            </>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {education ? 'Edit Education' : 'Add Education'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="institution">Institution *</Label>
                            <Input
                                id="institution"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                placeholder="Stanford University"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="degree">Degree *</Label>
                            <Input
                                id="degree"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                placeholder="Bachelor of Science"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fieldOfStudy">Field of Study</Label>
                            <Input
                                id="fieldOfStudy"
                                name="fieldOfStudy"
                                value={formData.fieldOfStudy || ''}
                                onChange={handleChange}
                                placeholder="Computer Science"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gpa">GPA</Label>
                            <Input
                                id="gpa"
                                name="gpa"
                                type="number"
                                step="0.01"
                                min="0"
                                max="4"
                                value={formData.gpa ?? ''}
                                onChange={handleChange}
                                placeholder="3.8"
                            />
                        </div>
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
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="Relevant coursework, achievements, activities..."
                            rows={3}
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
                            {loading ? 'Saving...' : education ? 'Save Changes' : 'Add Education'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
