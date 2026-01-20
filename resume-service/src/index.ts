import express from 'express';
import cors from 'cors';
import resumeRoutes from './routes/resume.routes.js';
import tailorRoutes from './routes/tailor.routes.js';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use('/api/resume', resumeRoutes);
app.use('/api/tailor', tailorRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Resume Service running on port ${PORT}`);
});
