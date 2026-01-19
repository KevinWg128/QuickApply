import { Router, type IRouter } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../utils/errorHandler.js';

const router: IRouter = Router();

// Get all work experiences
router.get('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        return res.json([]);
    }

    const experiences = await prisma.workExperience.findMany({
        where: { profileId: profile.id },
        orderBy: { orderIndex: 'asc' },
    });

    res.json(experiences);
});

// Get single work experience
router.get('/:id', async (req, res) => {
    const experience = await prisma.workExperience.findUnique({
        where: { id: req.params.id },
    });

    if (!experience) {
        throw new AppError('Work experience not found', 404);
    }

    res.json(experience);
});

// Create work experience
router.post('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        throw new AppError('Profile must be created first', 400);
    }

    const { company, title, location, startDate, endDate, description, isCurrent, orderIndex } = req.body;

    if (!company || !title || !startDate) {
        throw new AppError('Company, title, and start date are required', 400);
    }

    const experience = await prisma.workExperience.create({
        data: {
            profileId: profile.id,
            company,
            title,
            location,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            description,
            isCurrent: isCurrent ?? false,
            orderIndex: orderIndex ?? 0,
        },
    });

    res.status(201).json(experience);
});

// Update work experience
router.put('/:id', async (req, res) => {
    const { company, title, location, startDate, endDate, description, isCurrent, orderIndex } = req.body;

    const existing = await prisma.workExperience.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Work experience not found', 404);
    }

    const experience = await prisma.workExperience.update({
        where: { id: req.params.id },
        data: {
            company,
            title,
            location,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : null,
            description,
            isCurrent,
            orderIndex,
        },
    });

    res.json(experience);
});

// Delete work experience
router.delete('/:id', async (req, res) => {
    const existing = await prisma.workExperience.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Work experience not found', 404);
    }

    await prisma.workExperience.delete({
        where: { id: req.params.id },
    });

    res.status(204).send();
});

export default router;
