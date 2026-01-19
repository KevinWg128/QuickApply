'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileApi } from '@/lib/api';

interface ApiKeyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ApiKeyDialog({ open, onOpenChange, onSuccess }: ApiKeyDialogProps) {
    const [apiKey, setApiKey] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!apiKey.trim()) {
            setError('API Key is required');
            return;
        }

        setSaving(true);
        setError('');

        try {
            await profileApi.update({
                geminiApiKey: apiKey,
            });
            onSuccess();
            onOpenChange(false);
        } catch (err) {
            console.error('Failed to save API key:', err);
            setError('Failed to save API key. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enter Gemini API Key</DialogTitle>
                    <DialogDescription>
                        To use the AI features for resume parsing, please enter your Gemini API key.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input
                            id="apiKey"
                            type="password"
                            placeholder="Enter your Gemini API key"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                if (error) setError('');
                            }}
                        />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {saving ? 'Saving...' : 'Save API Key'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
