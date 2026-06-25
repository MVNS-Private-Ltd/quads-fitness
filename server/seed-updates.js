import prisma from './src/prisma.js';

async function main() {
  console.log('Starting seed updates...');

  // 1. Delete existing plans
  await prisma.plan.deleteMany({});
  
  // 2. Insert new plans
  await prisma.plan.createMany({
    data: [
      { name: '3 Months Plan', price: 2800, billing: '3 months', description: 'Standard 3-month access to all facilities.', features: '["Full Gym Access", "Locker Room", "Free Wi-Fi", "Basic Guidance"]', featured: false },
      { name: '13 Months Plan', price: 8000, billing: '13 months', description: 'Yearly access with 1 month free.', features: '["Full Gym Access", "Locker Room", "Free Wi-Fi", "Diet Plan Included", "Progress Tracking"]', featured: true },
      { name: 'Personal Trainer - 1 Month', price: 5000, billing: '1 month', description: 'One-on-one personal training for a month.', features: '["Dedicated Trainer", "Custom Workout Plan", "Diet Guidance", "Form Correction"]', featured: false },
      { name: 'Personal Trainer - 3 Months', price: 12000, billing: '3 months', description: 'Intensive 3-month personal training program.', features: '["Dedicated Trainer", "Custom Workout Plan", "Diet Guidance", "Weekly Check-ins", "Guaranteed Results"]', featured: true },
    ]
  });
  console.log('Inserted new membership plans.');

  // 3. Update Settings for Timings
  const timings = "5:00 AM – 10:00 AM | 11:00 AM – 9:00 PM";
  
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      mondayHours: timings,
      tuesdayHours: timings,
      wednesdayHours: timings,
      thursdayHours: timings,
      fridayHours: timings,
      saturdayHours: timings,
      sundayHours: timings,
      address: "Manimajra near Shivalik Garden, Police Station Shubhash Nagar, Manimajra"
    },
    create: {
      id: 1,
      mondayHours: timings,
      tuesdayHours: timings,
      wednesdayHours: timings,
      thursdayHours: timings,
      fridayHours: timings,
      saturdayHours: timings,
      sundayHours: timings,
      address: "Manimajra near Shivalik Garden, Police Station Shubhash Nagar, Manimajra"
    }
  });
  console.log('Updated Settings gym timings and address.');

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
