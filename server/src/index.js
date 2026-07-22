import dns from 'dns'; dns.setDefaultResultOrder('ipv4first');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { initCronJobs } from './services/cronService.js';
import prisma from './prisma.js';

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



app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🏋️  Quads Fitness API running on port ${PORT}`);
  console.log(`📦  Database: Supabase PostgreSQL\n`);
  
  // Force email to be nullable (safe no-op if already nullable)
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Member" ALTER COLUMN "email" DROP NOT NULL;`);
    console.log(`✅  Database schema synced successfully.`);
  } catch (e) {
    // Already nullable — ignore
  }

  // Ensure the 1 Month Plan at ₹1000 exists
  try {
    const existing = await prisma.plan.findFirst({ where: { name: '1 Month Plan' } });
    if (!existing) {
      await prisma.plan.create({
        data: {
          name: '1 Month Plan',
          price: 1000,
          billing: '1 month',
          description: 'Standard 1-month gym membership.',
          features: JSON.stringify(['Full Gym Access', 'Locker Room', 'Free Wi-Fi', 'Basic Guidance']),
          status: 'Active',
          featured: false,
        }
      });
      console.log(`✅  1 Month Plan (₹1000) added to database.`);
    }
  } catch (e) {
    console.error('Could not insert 1 Month Plan:', e.message);
  }
});
