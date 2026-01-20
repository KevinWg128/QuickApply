import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { PrismaClient } from '@prisma/client';

import jobApplicationRoutes from './routes/job-application.routes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();
const port = process.env.PORT || 3005;

export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'job-service' });
});

// Routes
app.use('/job-applications', jobApplicationRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Job service running on port ${port}`);
});
