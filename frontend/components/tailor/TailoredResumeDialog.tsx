'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { tailorApi, jobApplicationApi, profileApi } from '@/lib/api';
import type {
    JobApplication,
    Profile,
    TailoredContent,
} from '@/lib/types';
import {
    FileText,
    Download,
    Loader2,
    Pencil,
    Eye,
    X,
    Mail,
    RefreshCw,
    Settings,
    User,
} from 'lucide-react';

// Dynamic import for PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false, loading: () => <span>Loading...</span> }
);

// Dynamic import for PDF viewer
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div> }
);

// Import PDF documents
import { ResumeDocument } from '@/components/pdf/ResumeDocument';
import { CoverLetterDocument } from '@/components/pdf/CoverLetterDocument';

interface TailoredResumeDialogProps {
    application: JobApplication;
    trigger?: ReactNode;
}

export function TailoredResumeDialog({
    application,
    trigger,
}: TailoredResumeDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [content, setContent] = useState<TailoredContent | null>(null);

    // Editable states
    const [editedBullets, setEditedBullets] = useState<string[]>([]);
    const [editedKeySkills, setEditedKeySkills] = useState<string[]>([]);
    const [editedRelevantSkills, setEditedRelevantSkills] = useState<string[]>([]);
    const [editedCoverLetter, setEditedCoverLetter] = useState('');

    const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
    const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');

    // Error types for better user guidance
    type ValidationErrorType = 'no_profile' | 'no_api_key' | 'general';
    const [errorType, setErrorType] = useState<ValidationErrorType>('general');

    const generateContent = useCallback(async () => {
        setLoading(true);
        setError(null);
        setErrorType('general');

        try {
            // Pre-validate: Check if profile exists and has Gemini API key
            const existingProfile = await profileApi.get();

            if (!existingProfile) {
                setErrorType('no_profile');
                setError('Please create your profile first before tailoring your resume.');
                setLoading(false);
                return;
            }

            if (!existingProfile.geminiApiKey) {
                setErrorType('no_api_key');
                setError('Please enter your Gemini API key in Settings before tailoring your resume.');
                setLoading(false);
                return;
            }

            const response = await tailorApi.generate(application);
            setProfile(response.profile);
            setContent(response.data);

            // Initialize editable states
            setEditedBullets(response.data.summaryBullets);
            setEditedKeySkills(response.data.keySkills);
            setEditedRelevantSkills(response.data.relevantSkills);
            setEditedRelevantSkills(response.data.relevantSkills);
            setEditedCoverLetter(response.data.coverLetterBody);

            // Save the generated content to the database
            await jobApplicationApi.update(application.id, {
                tailoredResume: response.data,
            });

        } catch (err: any) {
            console.error('Error generating tailored content:', err);
            // Check for specific error messages from backend
            const errorMessage = err.message || 'Failed to generate tailored content';
            if (errorMessage.includes('Profile not found') || errorMessage.includes('create a profile')) {
                setErrorType('no_profile');
            } else if (errorMessage.includes('API Key') || errorMessage.includes('Gemini')) {
                setErrorType('no_api_key');
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [application]);

    useEffect(() => {
        if (open && !content && !loading) {
            if (application.tailoredResume) {
                setLoading(true);
                profileApi.get()
                    .then((p: Profile | null) => {
                        if (p) {
                            setProfile(p);
                            const saved = application.tailoredResume!;
                            setContent(saved);
                            setEditedBullets(saved.summaryBullets);
                            setEditedKeySkills(saved.keySkills);
                            setEditedRelevantSkills(saved.relevantSkills);
                            setEditedCoverLetter(saved.coverLetterBody);
                        }
                    })
                    .catch((err: any) => {
                        console.error('Error loading profile:', err);
                        setError('Failed to load profile');
                    })
                    .finally(() => setLoading(false));
            } else {
                generateContent();
            }
        }
    }, [open, content, loading, generateContent, application.tailoredResume]);

    const handleBulletChange = (index: number, value: string) => {
        const newBullets = [...editedBullets];
        newBullets[index] = value;
        setEditedBullets(newBullets);
    };

    const handleRemoveKeySkill = (skill: string) => {
        setEditedKeySkills(editedKeySkills.filter((s) => s !== skill));
    };

    const handleRemoveRelevantSkill = (skill: string) => {
        setEditedRelevantSkills(editedRelevantSkills.filter((s) => s !== skill));
    };

    const handleRegenerate = () => {
        setContent(null);
        generateContent();
    };

    const canPreview = profile && editedBullets.length === 5 && editedKeySkills.length >= 1;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Tailor Resume
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Tailored Documents for {application.jobTitle} at {application.company}
                    </DialogTitle>
                </DialogHeader>

                {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                            Analyzing job requirements and generating tailored content...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <p className="text-destructive text-center max-w-md">{error}</p>
                        <div className="flex gap-2">
                            {errorType === 'no_profile' && (
                                <Button
                                    onClick={() => {
                                        setOpen(false);
                                        router.push('/profile');
                                    }}
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    Create Profile
                                </Button>
                            )}
                            {errorType === 'no_api_key' && (
                                <Button
                                    onClick={() => {
                                        setOpen(false);
                                        router.push('/settings');
                                    }}
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Go to Settings
                                </Button>
                            )}
                            {errorType === 'general' && (
                                <Button onClick={handleRegenerate} variant="outline">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {!loading && !error && content && profile && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Tabs
                            value={activeTab}
                            onValueChange={(v) => setActiveTab(v as 'resume' | 'cover-letter')}
                            className="flex-1 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <TabsList>
                                    <TabsTrigger value="resume" className="gap-2">
                                        <FileText className="h-4 w-4" />
                                        Resume
                                    </TabsTrigger>
                                    <TabsTrigger value="cover-letter" className="gap-2">
                                        <Mail className="h-4 w-4" />
                                        Cover Letter
                                    </TabsTrigger>
                                </TabsList>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === 'preview' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('preview')}
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Preview
                                    </Button>
                                    <Button
                                        variant={viewMode === 'edit' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('edit')}
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRegenerate}
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <TabsContent value="resume" className="flex-1 overflow-hidden mt-0">
                                {viewMode === 'preview' ? (
                                    <div className="h-full flex flex-col">
                                        <div className="flex-1 border rounded-lg overflow-hidden">
                                            {canPreview && (
                                                <PDFViewer width="100%" height="100%" showToolbar={false}>
                                                    <ResumeDocument
                                                        profile={profile}
                                                        jobTitle={application.jobTitle}
                                                        summaryBullets={editedBullets}
                                                        keySkills={editedKeySkills}
                                                        relevantSkills={editedRelevantSkills}
                                                    />
                                                </PDFViewer>
                                            )}
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <PDFDownloadLink
                                                document={
                                                    <ResumeDocument
                                                        profile={profile}
                                                        jobTitle={application.jobTitle}
                                                        summaryBullets={editedBullets}
                                                        keySkills={editedKeySkills}
                                                        relevantSkills={editedRelevantSkills}
                                                    />
                                                }
                                                fileName={`${profile.name.replace(/\s+/g, '_')}_Resume_${application.company}.pdf`}
                                            >
                                                {({ loading: pdfLoading }) => (
                                                    <Button disabled={pdfLoading}>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        {pdfLoading ? 'Generating PDF...' : 'Download Resume'}
                                                    </Button>
                                                )}
                                            </PDFDownloadLink>
                                        </div>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-full">
                                        <div className="space-y-6 pr-4">
                                            {/* Key Skills */}
                                            <div>
                                                <h3 className="font-semibold mb-2">Key Skills (3 for title bar)</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {editedKeySkills.map((skill) => (
                                                        <Badge key={skill} variant="secondary" className="gap-1">
                                                            {skill}
                                                            <button
                                                                onClick={() => handleRemoveKeySkill(skill)}
                                                                className="ml-1 hover:text-destructive"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Summary Bullets */}
                                            <div>
                                                <h3 className="font-semibold mb-2">Summary Bullets (5)</h3>
                                                <div className="space-y-3">
                                                    {editedBullets.map((bullet, index) => (
                                                        <Textarea
                                                            key={index}
                                                            value={bullet}
                                                            onChange={(e) => handleBulletChange(index, e.target.value)}
                                                            rows={2}
                                                            className="resize-none"
                                                            placeholder={`Bullet point ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Relevant Skills */}
                                            <div>
                                                <h3 className="font-semibold mb-2">Technical Skills (up to 9)</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {editedRelevantSkills.map((skill) => (
                                                        <Badge key={skill} variant="outline" className="gap-1">
                                                            {skill}
                                                            <button
                                                                onClick={() => handleRemoveRelevantSkill(skill)}
                                                                className="ml-1 hover:text-destructive"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                )}
                            </TabsContent>

                            <TabsContent value="cover-letter" className="flex-1 overflow-hidden mt-0">
                                {viewMode === 'preview' ? (
                                    <div className="h-full flex flex-col">
                                        <div className="flex-1 border rounded-lg overflow-hidden">
                                            <PDFViewer width="100%" height="100%" showToolbar={false}>
                                                <CoverLetterDocument
                                                    profile={profile}
                                                    company={application.company}
                                                    jobTitle={application.jobTitle}
                                                    coverLetterBody={editedCoverLetter}
                                                />
                                            </PDFViewer>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <PDFDownloadLink
                                                document={
                                                    <CoverLetterDocument
                                                        profile={profile}
                                                        company={application.company}
                                                        jobTitle={application.jobTitle}
                                                        coverLetterBody={editedCoverLetter}
                                                    />
                                                }
                                                fileName={`${profile.name.replace(/\s+/g, '_')}_CoverLetter_${application.company}.pdf`}
                                            >
                                                {({ loading: pdfLoading }) => (
                                                    <Button disabled={pdfLoading}>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        {pdfLoading ? 'Generating PDF...' : 'Download Cover Letter'}
                                                    </Button>
                                                )}
                                            </PDFDownloadLink>
                                        </div>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-full">
                                        <div className="pr-4">
                                            <h3 className="font-semibold mb-2">Cover Letter Body</h3>
                                            <Textarea
                                                value={editedCoverLetter}
                                                onChange={(e) => setEditedCoverLetter(e.target.value)}
                                                rows={16}
                                                className="resize-none"
                                                placeholder="Cover letter content..."
                                            />
                                        </div>
                                    </ScrollArea>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
