'use client';

import { useState } from 'react';
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
import type { Profile, ProfileInput } from '@/lib/types';
import { Pencil, User } from 'lucide-react';

interface ProfileFormProps {
    profile?: Profile | null;
    onSubmit: (data: ProfileInput) => Promise<void>;
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ProfileInput>({
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        personalSiteUrl: profile?.personalSiteUrl || '',
        linkedinUrl: profile?.linkedinUrl || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            setOpen(false);
        } catch (error) {
            console.error('Failed to save profile:', error);
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
                <Button
                    variant={profile ? 'outline' : 'default'}
                    size={profile ? 'icon' : 'default'}
                    className={profile ? '' : 'gap-2'}
                >
                    {profile ? (
                        <Pencil className="h-4 w-4" />
                    ) : (
                        <>
                            <User className="h-4 w-4" />
                            Create Profile
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {profile ? 'Edit Profile' : 'Create Your Profile'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="personalSiteUrl">Personal Website</Label>
                        <Input
                            id="personalSiteUrl"
                            name="personalSiteUrl"
                            type="url"
                            value={formData.personalSiteUrl || ''}
                            onChange={handleChange}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                        <Input
                            id="linkedinUrl"
                            name="linkedinUrl"
                            type="url"
                            value={formData.linkedinUrl || ''}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/johndoe"
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
                            {loading ? 'Saving...' : profile ? 'Save Changes' : 'Create Profile'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
