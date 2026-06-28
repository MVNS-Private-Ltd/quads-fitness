import dns from 'dns';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

dns.setDefaultResultOrder('ipv4first');

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const gallery = await prisma.gallery.findMany();
  console.log(JSON.stringify(gallery, null, 2));
  await prisma.$disconnect();
  pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
