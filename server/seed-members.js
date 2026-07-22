// Bulk member seed script — run from the server/ directory
// Command: node seed-members.js

import prisma from './src/prisma.js';

function addMonths(dateStr, months) {
  // dateStr: 'YYYY-MM-DD'
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

const members = [
  // 1. Gaurav — 8/7/26, 1m, ₹2000 (split with Amit — ₹1000 each)
  { name: 'Gaurav',           joinedAt: '2026-07-08', months: 1, paid: 2000, note: 'Joined with Amit' },
  { name: 'Amit',             joinedAt: '2026-07-08', months: 1, paid: 1000, note: 'Joined with Gaurav' },

  // 2. Dinkesh — 28/7/26, 1m, ₹1000
  { name: 'Dinkesh',          joinedAt: '2026-07-28', months: 1, paid: 1000 },

  // 3. Amarnath — 2/7/26, 1m, ₹1100
  { name: 'Amarnath',         joinedAt: '2026-07-02', months: 1, paid: 1100 },

  // 4. Divya — 29/6/26, 1m, ₹1000
  { name: 'Divya',            joinedAt: '2026-06-29', months: 1, paid: 1000 },

  // 5. Avinash Thakur — 2/7/26, 1m, ₹1000
  { name: 'Avinash Thakur',   joinedAt: '2026-07-02', months: 1, paid: 1000 },

  // 6. Ashish (headphone) — 1/7/26, 1m, ₹1100
  { name: 'Ashish',           joinedAt: '2026-07-01', months: 1, paid: 1100, note: 'Headphone' },

  // 7. Ankush Sharma — 1/7/26, 1m, ₹1000
  { name: 'Ankush Sharma',    joinedAt: '2026-07-01', months: 1, paid: 1000 },

  // 8. Hair Dresser — 1/7/26, 1m, ₹1000
  { name: 'Hair Dresser',     joinedAt: '2026-07-01', months: 1, paid: 1000 },

  // 9. Sintu — 3/7/26, 3m, ₹5200 (two members — split ~2600 each)
  { name: 'Sintu',            joinedAt: '2026-07-03', months: 3, paid: 2600, note: 'Joined with Ashutosh' },
  { name: 'Ashutosh',         joinedAt: '2026-07-03', months: 3, paid: 2600, note: 'Joined with Sintu' },

  // 10. Abhinav — 3/7/26, 4m, ₹3400
  { name: 'Abhinav',          joinedAt: '2026-07-03', months: 4, paid: 3400, note: 'Old member' },

  // 11. Vinod (police) — 1/6/26, 4m, ₹3200
  { name: 'Vinod',            joinedAt: '2026-06-01', months: 4, paid: 3200, note: 'Police' },

  // 12. Rakesh — 4/7/26, 3m, ₹2800
  { name: 'Rakesh',           joinedAt: '2026-07-04', months: 3, paid: 2800 },

  // 13. Sanchi — 28/6/26, 1m, ₹1000
  { name: 'Sanchi',           joinedAt: '2026-06-28', months: 1, paid: 1000 },

  // 14. Ajay — 6/7/26, 1m, ₹1000
  { name: 'Ajay',             joinedAt: '2026-07-06', months: 1, paid: 1000, note: 'Old member' },

  // 15. Dev Jatar — 6/7/26, 3m, ₹2600
  { name: 'Dev Jatar',        joinedAt: '2026-07-06', months: 3, paid: 2600 },

  // 16. Amit (police) — 4/7/26, 1m, ₹1000
  { name: 'Amit Police',      joinedAt: '2026-07-04', months: 1, paid: 1000, note: 'Police' },
];

async function main() {
  console.log(`\n🌱 Bulk inserting ${members.length} members...\n`);

  let created = 0;
  let skipped = 0;

  for (const m of members) {
    const expiry = addMonths(m.joinedAt, m.months);
    const notes = [
      m.note || '',
      `Paid: ₹${m.paid}`,
      `Duration: ${m.months} month${m.months > 1 ? 's' : ''}`,
    ].filter(Boolean).join(' | ');

    // Status: Expired only if expiry is strictly before today (July 22, 2026)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(expiry);
    const status = expiryDate < today ? 'Expired' : 'Active';

    try {
      await prisma.member.create({
        data: {
          name: m.name,
          joinedAt: new Date(m.joinedAt),
          membershipExpiry: new Date(expiry),
          status,
          healthNotes: notes,
        }
      });
      console.log(`  ✅  ${m.name.padEnd(22)} | Start: ${m.joinedAt} | Expiry: ${expiry} | ₹${m.paid} | ${status}`);
      created++;
    } catch (err) {
      console.error(`  ❌  ${m.name}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n🏋️  Done! Created: ${created} | Skipped: ${skipped}\n`);
}

main()
  .catch(e => { console.error('Fatal error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
