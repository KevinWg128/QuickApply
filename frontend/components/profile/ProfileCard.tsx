import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from './ProfileForm';
import type { Profile, ProfileInput } from '@/lib/types';
import { Mail, Globe, Linkedin, User, Phone } from 'lucide-react';

interface ProfileCardProps {
    profile: Profile | null;
    onUpdate: (data: ProfileInput) => Promise<void>;
}

export function ProfileCard({ profile, onUpdate }: ProfileCardProps) {
    if (!profile) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                        <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No Profile Yet</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Create your profile to get started with Quick Apply
                    </p>
                    <ProfileForm onSubmit={onUpdate} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
            <CardHeader className="relative flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                        {profile.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                    </div>
                    <div>
                        <CardTitle className="text-2xl">{profile.name}</CardTitle>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {profile.email}
                        </div>
                        {profile.phone && (
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {profile.phone}
                            </div>
                        )}
                    </div>
                </div>
                <ProfileForm profile={profile} onSubmit={onUpdate} />
            </CardHeader>
            <CardContent className="relative pt-4">
                <div className="flex flex-wrap gap-4">
                    {profile.personalSiteUrl && (
                        <a
                            href={profile.personalSiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Globe className="h-4 w-4" />
                            Personal Site
                        </a>
                    )}
                    {profile.linkedinUrl && (
                        <a
                            href={profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
