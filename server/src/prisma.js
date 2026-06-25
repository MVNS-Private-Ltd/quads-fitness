import dns from 'dns';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Force IPv4 DNS resolution - Railway doesn't support IPv6 outbound
dns.setDefaultResultOrder('ipv4first');


const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
