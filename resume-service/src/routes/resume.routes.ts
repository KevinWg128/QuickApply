import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { parseResume } from '../services/gemini.service.js';
import { getProfile, updateProfileWithResumeData } from '../services/profile.service.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No resume file uploaded' });
            return;
        }

        console.log(`Received file: ${req.file.originalname} (${req.file.mimetype})`);

        // 1. Get Profile to retrieve API Key
        const profile = await getProfile();

        // Handle case where profile might be null or empty (if profile-service returns null for first time?) 
        // But profile-service usually returns a profile object or if not found?
        // Let's assume profile service returns 200 with data or 200 with null?
        // My previous view of profile.routes.ts: `const profile = await prisma.profile.findFirst(...)`.
        // If no profile, it returns null.

        if (!profile) {
            // If no profile, we can't get API key. 
            // Unless we allow passing API key in headers?
            // But requirement says "initial input... and store...".
            // Maybe user creates profile FIRST with name/email/apikey, THEN uploads resume?
            // Or we accept API key in this request and create profile? 
            // "allow user to upload... and update into the database using profile service"
            // If profile doesn't exist, we can't "update".

            // I'll assume profile exists (created via frontend first step with API key).
            // or I check req.body.geminiApiKey?

            // Let's check headers or body just in case, but prefer profile.
            res.status(400).json({ error: 'Profile not found. Please create a profile with Gemini API Key first.' });
            return;
        }

        const apiKey = profile.geminiApiKey;
        if (!apiKey) {
            res.status(400).json({ error: 'Gemini API Key not found in profile. Please update your profile.' });
            return;
        }

        // 2. Parse Resume (pass original filename for MIME type detection fallback)
        const parsedData = await parseResume(req.file.path, req.file.mimetype, apiKey, req.file.originalname);
        console.log('Resume parsed successfully.');

        // 3. Update Profile
        await updateProfileWithResumeData(parsedData);
        console.log('Profile updated.');

        res.json({ message: 'Resume processed and profile updated successfully', data: parsedData });

    } catch (error: any) {
        console.error('Error processing resume:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    } finally {
        // Cleanup uploaded file
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('Failed to delete uploaded file:', e);
            }
        }
    }
});

export default router;
