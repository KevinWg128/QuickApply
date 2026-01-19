import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { PrismaClient } from '@prisma/client';

import profileRoutes from './routes/profile.routes.js';
import experienceRoutes from './routes/experience.routes.js';
import educationRoutes from './routes/education.routes.js';
import skillRoutes from './routes/skill.routes.js';
import projectRoutes from './routes/project.routes.js';
import certificationRoutes from './routes/certification.routes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();
const port = process.env.PORT || 3001;

export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'profile-service' });
});

// Routes
app.use('/profile', profileRoutes);
app.use('/experiences', experienceRoutes);
app.use('/education', educationRoutes);
app.use('/skills', skillRoutes);
app.use('/projects', projectRoutes);
app.use('/certifications', certificationRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Profile service running on port ${port}`);
});
