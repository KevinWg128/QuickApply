'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { profileApi } from '@/lib/api';
import type { Profile } from '@/lib/types';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [geminiApiKey, setGeminiApiKey] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileApi.get();
                setProfile(data);
                if (data?.geminiApiKey) {
                    setGeminiApiKey(data.geminiApiKey);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            let updatedProfile;
            if (profile) {
                // Update existing profile
                updatedProfile = await profileApi.update({
                    geminiApiKey: geminiApiKey,
                });
            } else {
                // Create new profile with placeholder values - API key is what matters here
                updatedProfile = await profileApi.create({
                    name: 'New User',
                    email: 'user@example.com',
                    geminiApiKey: geminiApiKey,
                });
            }
            setProfile(updatedProfile);
            // Optional: Show success message/toast
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
                <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-4 sm:px-6">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-bold tracking-tight">Settings</h1>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Configuration</CardTitle>
                            <CardDescription>
                                Configure your API keys for AI-powered features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gemini-key">Gemini API Key</Label>
                                <Input
                                    id="gemini-key"
                                    type="password"
                                    placeholder="Enter your Gemini API key"
                                    value={geminiApiKey}
                                    onChange={(e) => setGeminiApiKey(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your API key is used to analyze your resume and extract information.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}
