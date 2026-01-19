import { Router, type IRouter } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../utils/errorHandler.js';

const router: IRouter = Router();

// Get the profile (single profile mode - returns first profile or null)
router.get('/', async (req, res) => {
    const profile = await prisma.profile.findFirst({
        include: {
            workExperiences: { orderBy: { orderIndex: 'asc' } },
            educations: { orderBy: { orderIndex: 'asc' } },
            skills: { orderBy: { orderIndex: 'asc' } },
            projects: { orderBy: { orderIndex: 'asc' } },
            certifications: { orderBy: { orderIndex: 'asc' } },
        },
    });

    res.json(profile);
});

// Create or update profile (upsert - single profile mode)
router.post('/', async (req, res) => {
    const { name, email, phone, geminiApiKey, personalSiteUrl, linkedinUrl } = req.body;

    if (!name || !email) {
        throw new AppError('Name and email are required', 400);
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst();

    let profile;
    if (existingProfile) {
        // Update existing profile
        profile = await prisma.profile.update({
            where: { id: existingProfile.id },
            data: { name, email, phone, geminiApiKey, personalSiteUrl, linkedinUrl },
        });
    } else {
        // Create new profile
        profile = await prisma.profile.create({
            data: { name, email, phone, geminiApiKey, personalSiteUrl, linkedinUrl },
        });
    }

    res.status(existingProfile ? 200 : 201).json(profile);
});

// Update profile
router.put('/', async (req, res) => {
    const { name, email, phone, geminiApiKey, personalSiteUrl, linkedinUrl } = req.body;

    const existingProfile = await prisma.profile.findFirst();
    if (!existingProfile) {
        throw new AppError('Profile not found', 404);
    }

    const profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: { name, email, phone, geminiApiKey, personalSiteUrl, linkedinUrl },
    });

    res.json(profile);
});

export default router;
