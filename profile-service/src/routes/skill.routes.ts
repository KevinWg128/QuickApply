import { Router, type IRouter } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../utils/errorHandler.js';

const router: IRouter = Router();

// Get all skills
router.get('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        return res.json([]);
    }

    const skills = await prisma.skill.findMany({
        where: { profileId: profile.id },
        orderBy: { orderIndex: 'asc' },
    });

    res.json(skills);
});

// Get single skill
router.get('/:id', async (req, res) => {
    const skill = await prisma.skill.findUnique({
        where: { id: req.params.id },
    });

    if (!skill) {
        throw new AppError('Skill not found', 404);
    }

    res.json(skill);
});

// Create skill
router.post('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        throw new AppError('Profile must be created first', 400);
    }

    const { name, category, proficiency, orderIndex } = req.body;

    if (!name) {
        throw new AppError('Skill name is required', 400);
    }

    const skill = await prisma.skill.create({
        data: {
            profileId: profile.id,
            name,
            category,
            proficiency,
            orderIndex: orderIndex ?? 0,
        },
    });

    res.status(201).json(skill);
});

// Bulk create skills
router.post('/bulk', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        throw new AppError('Profile must be created first', 400);
    }

    const { skills } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
        throw new AppError('Skills array is required', 400);
    }

    const createdSkills = await prisma.skill.createMany({
        data: skills.map((skill: { name: string; category?: string; proficiency?: string; orderIndex?: number }, index: number) => ({
            profileId: profile.id,
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            orderIndex: skill.orderIndex ?? index,
        })),
    });

    res.status(201).json({ count: createdSkills.count });
});

// Update skill
router.put('/:id', async (req, res) => {
    const { name, category, proficiency, orderIndex } = req.body;

    const existing = await prisma.skill.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Skill not found', 404);
    }

    const skill = await prisma.skill.update({
        where: { id: req.params.id },
        data: {
            name,
            category,
            proficiency,
            orderIndex,
        },
    });

    res.json(skill);
});

// Delete skill
router.delete('/:id', async (req, res) => {
    const existing = await prisma.skill.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Skill not found', 404);
    }

    await prisma.skill.delete({
        where: { id: req.params.id },
    });

    res.status(204).send();
});

export default router;
