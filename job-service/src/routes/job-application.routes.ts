import { Router, type IRouter } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../utils/errorHandler.js';

const router: IRouter = Router();

// Valid page sizes
const VALID_PAGE_SIZES = [20, 50, 100];

// Get all job applications with pagination
router.get('/', async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = VALID_PAGE_SIZES.includes(parseInt(req.query.limit as string))
        ? parseInt(req.query.limit as string)
        : 20;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
        prisma.jobApplication.findMany({
            orderBy: { appliedAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.jobApplication.count(),
    ]);

    res.json({
        data: applications,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});

// Get single job application
router.get('/:id', async (req, res) => {
    const application = await prisma.jobApplication.findUnique({
        where: { id: req.params.id },
    });

    if (!application) {
        throw new AppError('Job application not found', 404);
    }

    res.json(application);
});

// Create job application
router.post('/', async (req, res) => {
    const { jobUrl, jobTitle, company, jobDescription, notes, appliedAt } = req.body;

    if (!jobTitle || !company) {
        throw new AppError('Job title and company are required', 400);
    }

    const application = await prisma.jobApplication.create({
        data: {
            jobUrl,
            jobTitle,
            company,
            jobDescription,
            notes,
            status: 'APPLIED',
            appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
        },
    });

    res.status(201).json(application);
});

// Update job application
router.put('/:id', async (req, res) => {
    const { jobUrl, jobTitle, company, jobDescription, notes, status, appliedAt } = req.body;

    const existing = await prisma.jobApplication.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Job application not found', 404);
    }

    // Validate status if provided
    const validStatuses = ['APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER', 'WITHDRAWN'];
    if (status && !validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const application = await prisma.jobApplication.update({
        where: { id: req.params.id },
        data: {
            jobUrl,
            jobTitle,
            company,
            jobDescription,
            notes,
            status,
            appliedAt: appliedAt ? new Date(appliedAt) : undefined,
            tailoredResume: req.body.tailoredResume,
        },
    });

    res.json(application);
});

// Delete job application
router.delete('/:id', async (req, res) => {
    const existing = await prisma.jobApplication.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Job application not found', 404);
    }

    await prisma.jobApplication.delete({
        where: { id: req.params.id },
    });

    res.status(204).send();
});

export default router;
