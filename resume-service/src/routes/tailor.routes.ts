import { Router } from 'express';
import { generateTailoredContent } from '../services/gemini.service.js';
import { getProfile } from '../services/profile.service.js';

const router = Router();

// Generate tailored resume content
router.post('/generate', async (req, res) => {
    try {
        const { jobApplication } = req.body;

        if (!jobApplication) {
            res.status(400).json({ error: 'Job application data is required' });
            return;
        }

        // Get profile to retrieve API key and user data
        const profile = await getProfile();

        if (!profile) {
            res.status(400).json({ error: 'Profile not found. Please create a profile first.' });
            return;
        }

        const apiKey = profile.geminiApiKey;
        if (!apiKey) {
            res.status(400).json({ error: 'Gemini API Key not found in profile. Please update your profile.' });
            return;
        }

        console.log(`Generating tailored content for job: ${jobApplication.jobTitle} at ${jobApplication.company}`);

        // Generate tailored content using Gemini
        const tailoredContent = await generateTailoredContent(
            jobApplication,
            profile,
            apiKey
        );

        console.log('Tailored content generated successfully.');

        res.json({
            message: 'Tailored content generated successfully',
            data: tailoredContent,
            profile: profile // Include full profile for PDF generation
        });

    } catch (error: any) {
        console.error('Error generating tailored content:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

export default router;
