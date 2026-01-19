'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Certification, CertificationInput } from '@/lib/types';
import { Pencil, Plus } from 'lucide-react';

interface CertificationFormProps {
    certification?: Certification;
    onSubmit: (data: CertificationInput) => Promise<void>;
    trigger?: React.ReactNode;
}

export function CertificationForm({ certification, onSubmit, trigger }: CertificationFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CertificationInput>({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
    });

    useEffect(() => {
        if (certification) {
            setFormData({
                name: certification.name,
                issuer: certification.issuer,
                issueDate: certification.issueDate.split('T')[0],
                expiryDate: certification.expiryDate?.split('T')[0] || '',
                credentialId: certification.credentialId || '',
                credentialUrl: certification.credentialUrl || '',
            });
        }
    }, [certification]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            setOpen(false);
            if (!certification) {
                setFormData({
                    name: '',
                    issuer: '',
                    issueDate: '',
                    expiryDate: '',
                    credentialId: '',
                    credentialUrl: '',
                });
            }
        } catch (error) {
            console.error('Failed to save certification:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant={certification ? 'ghost' : 'outline'}
                        size={certification ? 'icon' : 'default'}
                        className={certification ? 'h-8 w-8' : 'gap-2'}
                    >
                        {certification ? (
                            <Pencil className="h-4 w-4" />
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Add Certification
                            </>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {certification ? 'Edit Certification' : 'Add Certification'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Certification Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="AWS Solutions Architect"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="issuer">Issuing Organization *</Label>
                            <Input
                                id="issuer"
                                name="issuer"
                                value={formData.issuer}
                                onChange={handleChange}
                                placeholder="Amazon Web Services"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="issueDate">Issue Date *</Label>
                            <Input
                                id="issueDate"
                                name="issueDate"
                                type="date"
                                value={formData.issueDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                                id="expiryDate"
                                name="expiryDate"
                                type="date"
                                value={formData.expiryDate || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="credentialId">Credential ID</Label>
                            <Input
                                id="credentialId"
                                name="credentialId"
                                value={formData.credentialId || ''}
                                onChange={handleChange}
                                placeholder="ABC123XYZ"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="credentialUrl">Credential URL</Label>
                            <Input
                                id="credentialUrl"
                                name="credentialUrl"
                                type="url"
                                value={formData.credentialUrl || ''}
                                onChange={handleChange}
                                placeholder="https://verify.example.com/..."
                            />
                        </div>
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
                            {loading ? 'Saving...' : certification ? 'Save Changes' : 'Add Certification'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
