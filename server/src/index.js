import dns from 'dns'; dns.setDefaultResultOrder('ipv4first');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { initCronJobs } from './services/cronService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Cron Jobs
initCronJobs();

// ── Middleware ────────────────────────────────────────────────────────────────
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'https://quad-fitness.netlify.app',
  'https://quads-fitness.vercel.app',
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? [...new Set([...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()), ...defaultAllowedOrigins])]
  : defaultAllowedOrigins;

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('[CORS] Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
}, apiRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Quads Fitness API running' }));

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🏋️  Quads Fitness API running on port ${PORT}`);
  console.log(`📦  Database: Supabase PostgreSQL\n`);
});
