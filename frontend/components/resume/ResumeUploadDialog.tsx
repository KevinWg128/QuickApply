import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { resumeApi } from '@/lib/api';

interface ResumeUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ResumeUploadDialog({
    open,
    onOpenChange,
    onSuccess,
}: ResumeUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setSuccess(false);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            await resumeApi.upload(file);
            setSuccess(true);
            setFile(null);
            // Wait a moment before closing or refreshing to show success state
            setTimeout(() => {
                onSuccess();
                onOpenChange(false);
                setSuccess(false); // Reset for next time
            }, 1500);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Failed to upload resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const resetState = () => {
        setFile(null);
        setError(null);
        setSuccess(false);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) resetState();
            onOpenChange(val);
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center">Upload Resume</DialogTitle>
                    <DialogDescription className="text-center">
                        Upload your resume to automatically populate your profile.
                        Supported formats: PDF, DOCX, Markdown.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="resume">Resume</Label>
                        <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.docx,.md"
                            onChange={handleFileChange}
                            disabled={uploading || success}
                        />
                    </div>

                    {file && !success && (
                        <div className="flex items-center gap-2 rounded-md border p-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span className="truncate">{file.name}</span>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-md justify-center">
                            <CheckCircle2 className="h-4 w-4" />
                            <p>Resume uploaded and processed successfully!</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleUpload}
                        disabled={!file || uploading || success}
                        className="w-full"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : success ? (
                            'Done'
                        ) : (
                            'Upload & Extract'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
