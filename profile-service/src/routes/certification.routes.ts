import { Router, type IRouter } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../utils/errorHandler.js';

const router: IRouter = Router();

// Get all certifications
router.get('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        return res.json([]);
    }

    const certifications = await prisma.certification.findMany({
        where: { profileId: profile.id },
        orderBy: { orderIndex: 'asc' },
    });

    res.json(certifications);
});

// Get single certification
router.get('/:id', async (req, res) => {
    const certification = await prisma.certification.findUnique({
        where: { id: req.params.id },
    });

    if (!certification) {
        throw new AppError('Certification not found', 404);
    }

    res.json(certification);
});

// Create certification
router.post('/', async (req, res) => {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
        throw new AppError('Profile must be created first', 400);
    }

    const { name, issuer, issueDate, expiryDate, credentialId, credentialUrl, orderIndex } = req.body;

    if (!name || !issuer || !issueDate) {
        throw new AppError('Name, issuer, and issue date are required', 400);
    }

    const certification = await prisma.certification.create({
        data: {
            profileId: profile.id,
            name,
            issuer,
            issueDate: new Date(issueDate),
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            credentialId,
            credentialUrl,
            orderIndex: orderIndex ?? 0,
        },
    });

    res.status(201).json(certification);
});

// Update certification
router.put('/:id', async (req, res) => {
    const { name, issuer, issueDate, expiryDate, credentialId, credentialUrl, orderIndex } = req.body;

    const existing = await prisma.certification.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Certification not found', 404);
    }

    const certification = await prisma.certification.update({
        where: { id: req.params.id },
        data: {
            name,
            issuer,
            issueDate: issueDate ? new Date(issueDate) : undefined,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            credentialId,
            credentialUrl,
            orderIndex,
        },
    });

    res.json(certification);
});

// Delete certification
router.delete('/:id', async (req, res) => {
    const existing = await prisma.certification.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        throw new AppError('Certification not found', 404);
    }

    await prisma.certification.delete({
        where: { id: req.params.id },
    });

    res.status(204).send();
});

export default router;
