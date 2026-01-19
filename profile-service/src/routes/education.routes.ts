import { Router, type IRouter } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../utils/errorHandler.js';

const router: IRouter = Router();

// Get all education entries
router.get('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        return res.json([]);
    }

    const educations = await prisma.education.findMany({
        where: { profileId: profile.id },
        orderBy: { orderIndex: 'asc' },
    });

    res.json(educations);
});

// Get single education entry
router.get('/:id', async (req, res) => {
    const education = await prisma.education.findUnique({
        where: { id: req.params.id },
    });

    if (!education) {
        throw new AppError('Education entry not found', 404);
    }

    res.json(education);
});

// Create education entry
router.post('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        throw new AppError('Profile must be created first', 400);
    }

    const { institution, degree, fieldOfStudy, startDate, endDate, gpa, description, orderIndex } = req.body;

    if (!institution || !degree || !startDate) {
        throw new AppError('Institution, degree, and start date are required', 400);
    }

    const education = await prisma.education.create({
        data: {
            profileId: profile.id,
            institution,
            degree,
            fieldOfStudy,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            gpa,
            description,
            orderIndex: orderIndex ?? 0,
        },
    });

    res.status(201).json(education);
});

// Update education entry
router.put('/:id', async (req, res) => {
    const { institution, degree, fieldOfStudy, startDate, endDate, gpa, description, orderIndex } = req.body;

    const existing = await prisma.education.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Education entry not found', 404);
    }

    const education = await prisma.education.update({
        where: { id: req.params.id },
        data: {
            institution,
            degree,
            fieldOfStudy,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : null,
            gpa,
            description,
            orderIndex,
        },
    });

    res.json(education);
});

// Delete education entry
router.delete('/:id', async (req, res) => {
    const existing = await prisma.education.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Education entry not found', 404);
    }

    await prisma.education.delete({
        where: { id: req.params.id },
    });

    res.status(204).send();
});

export default router;
