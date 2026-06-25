import prisma from './src/prisma.js';

async function main() {
  console.log('🌱 Seeding database...');

  // Settings
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      gymName: 'Quads Fitness',
      tagline: 'Train Hard. Live Strong.',
      email: 'hello@quadsfitness.com',
      phone: '+1 (555) 123-4567',
      address: 'Manimajra near Shivalik Garden, Police Station Shubhash Nagar, Manimajra',
      instagram: 'https://instagram.com/quadsfitness',
      facebook: 'https://facebook.com/quadsfitness',
      twitter: '',
      youtube: '',
      mondayHours: '05:00 - 23:00',
      tuesdayHours: '05:00 - 23:00',
      wednesdayHours: '05:00 - 23:00',
      thursdayHours: '05:00 - 23:00',
      fridayHours: '05:00 - 23:00',
      saturdayHours: '05:00 - 22:00',
      sundayHours: '07:00 - 20:00',
      primaryColor: '#d4af37',
      metaTitle: 'Quads Fitness - Train Hard. Live Strong.',
      metaDescription: 'Premium fitness center offering elite training programs, nutrition coaching, and a supportive community.',
    },
  });

  // Plans
  const basic = await prisma.plan.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'Basic', price: 29, billing: 'month', description: 'Perfect for beginners', features: JSON.stringify(['Access to gym floor', 'Locker room access', 'Basic fitness assessment']), status: 'Active' } });
  const pro = await prisma.plan.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: 'Pro', price: 59, billing: 'month', description: 'Most popular choice', features: JSON.stringify(['All Basic features', 'Group classes', 'Nutrition guide', '1 PT session/month']), status: 'Active', featured: true } });
  const elite = await prisma.plan.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: 'Elite', price: 99, billing: 'month', description: 'Maximum transformation', features: JSON.stringify(['All Pro features', 'Unlimited PT sessions', 'Custom meal plan', 'Priority booking']), status: 'Active' } });

  // Trainers
  await prisma.trainer.createMany({
    data: [
      { name: 'Dave Miller', specialty: 'Powerlifting & Strength', bio: 'Former competitive powerlifter with 10 years of coaching experience.', status: 'Active', featured: true },
      { name: 'Sarah Williams', specialty: 'HIIT & Cardio', bio: 'Certified HIIT instructor helping clients burn fat and build endurance.', status: 'Active', featured: true },
      { name: 'Emma Davis', specialty: 'Yoga & Mobility', bio: 'Yoga for athletes — improving recovery, flexibility and mindfulness.', status: 'Active' },
    ],
  });

  // Programs
  await prisma.program.createMany({
    data: [
      { title: 'Powerlifting Fundamentals', instructor: 'Dave Miller', duration: '8 Weeks', schedule: 'Mon / Wed / Fri', participants: 45, status: 'Active', featured: true, description: 'Build raw strength from the ground up with progressive overload principles.' },
      { title: 'HIIT Extreme', instructor: 'Sarah Williams', duration: '4 Weeks', schedule: 'Tue / Thu / Sat', participants: 32, status: 'Active', description: 'High-intensity interval training designed to maximize calorie burn.' },
      { title: 'Yoga for Lifters', instructor: 'Emma Davis', duration: 'Ongoing', schedule: 'Sunday', participants: 18, status: 'Active', description: 'Improve mobility, recovery and mental focus through structured yoga.' },
    ],
  });

  // Diet Plans
  await prisma.dietPlan.createMany({
    data: [
      { title: 'Bulking Macro Plan', goalType: 'Muscle Gain', calories: '3200 kcal', meals: 5, status: 'Active' },
      { title: 'Lean Shredding', goalType: 'Fat Loss', calories: '2100 kcal', meals: 4, status: 'Active' },
      { title: 'Vegetarian Athlete', goalType: 'Maintenance', calories: '2500 kcal', meals: 4, status: 'Active' },
    ],
  });

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      { clientName: 'Alex Johnson', transformation: 'Lost 18kg in 4 months', quote: 'Quads Fitness completely changed my life. The trainers are world-class.', rating: 5, status: 'Published', featured: true },
      { clientName: 'Priya Sharma', transformation: 'Gained 8kg of muscle in 6 months', quote: 'The nutrition guidance and PT sessions are unlike anything I\'ve experienced.', rating: 5, status: 'Published', featured: true },
      { clientName: 'Marcus Webb', transformation: 'Competed in first powerlifting meet', quote: 'Dave\'s coaching is methodical and effective. I hit a 200kg deadlift!', rating: 5, status: 'Published' },
    ],
  });

  // Offers
  await prisma.offer.createMany({
    data: [
      { title: 'Summer Shred Package', description: 'Get 2 months of Pro membership for the price of 1. Limited slots available.', badgeText: 'LIMITED TIME', status: 'Active', featured: true },
      { title: 'Refer a Friend', description: 'Bring a friend and both get one free PT session.', badgeText: 'ONGOING', status: 'Active' },
    ],
  });

  // Members
  const member1 = await prisma.member.upsert({ where: { email: 'alex@example.com' }, update: {}, create: { name: 'Alex Johnson', email: 'alex@example.com', phone: '+1 555-0101', planId: pro.id, status: 'Active' } });
  const member2 = await prisma.member.upsert({ where: { email: 'sarah@example.com' }, update: {}, create: { name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 555-0102', planId: basic.id, status: 'Active' } });

  // Activity logs
  await prisma.activityLog.createMany({
    data: [
      { action: 'Database Seeded', details: 'Initial seed data loaded', entity: 'System' },
      { action: 'Settings Initialized', details: 'Gym settings created with defaults', entity: 'Settings' },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('   → Plans:', 3);
  console.log('   → Trainers:', 3);
  console.log('   → Programs:', 3);
  console.log('   → Members:', 2);
  console.log('   → Testimonials:', 3);
  console.log('   → Offers:', 2);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
