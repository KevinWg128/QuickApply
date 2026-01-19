import { Router, type IRouter } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../utils/errorHandler.js';

const router: IRouter = Router();

// Get all projects (includes both projects and awards based on type)
router.get('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        return res.json([]);
    }

    const { type } = req.query;
    const where: { profileId: string; type?: string } = { profileId: profile.id };

    if (type === 'project' || type === 'award') {
        where.type = type;
    }

    const projects = await prisma.project.findMany({
        where,
        orderBy: { orderIndex: 'asc' },
    });

    res.json(projects);
});

// Get single project
router.get('/:id', async (req, res) => {
    const project = await prisma.project.findUnique({
        where: { id: req.params.id },
    });

    if (!project) {
        throw new AppError('Project not found', 404);
    }

    res.json(project);
});

// Create project
router.post('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        throw new AppError('Profile must be created first', 400);
    }

    const { name, description, url, startDate, endDate, type, orderIndex } = req.body;

    if (!name) {
        throw new AppError('Project name is required', 400);
    }

    const project = await prisma.project.create({
        data: {
            profileId: profile.id,
            name,
            description,
            url,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            type: type ?? 'project',
            orderIndex: orderIndex ?? 0,
        },
    });

    res.status(201).json(project);
});

// Update project
router.put('/:id', async (req, res) => {
    const { name, description, url, startDate, endDate, type, orderIndex } = req.body;

    const existing = await prisma.project.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Project not found', 404);
    }

    const project = await prisma.project.update({
        where: { id: req.params.id },
        data: {
            name,
            description,
            url,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : null,
            type,
            orderIndex,
        },
    });

    res.json(project);
});

// Delete project
router.delete('/:id', async (req, res) => {
    const existing = await prisma.project.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Project not found', 404);
    }

    await prisma.project.delete({
        where: { id: req.params.id },
    });

    res.status(204).send();
});

export default router;
