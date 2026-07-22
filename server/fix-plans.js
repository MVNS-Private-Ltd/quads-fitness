import prisma from './src/prisma.js';

async function fix() {
  const plans = await prisma.plan.findMany();
  
  const members = await prisma.member.findMany({ where: { planId: null } });
  console.log(`Found ${members.length} members with no plan.`);

  for (const m of members) {
    if (!m.healthNotes) continue;
    // parse price and duration from healthNotes
    const matchPrice = m.healthNotes.match(/Paid: ₹(\d+)/);
    const matchDur = m.healthNotes.match(/Duration: (.*?)(?: \||$)/);
    
    if (matchPrice && matchDur) {
      const price = Number(matchPrice[1]);
      const dur = matchDur[1].trim(); // e.g. "1 month", "3 months"
      
      let planName = dur;
      if (dur === '1 month') planName = '1 Month Plan';
      else if (dur === '3 months') planName = '3 Months Plan';
      else planName = `Custom Plan (${dur})`;

      // check if plan exists
      let plan = plans.find(p => p.name.toLowerCase() === planName.toLowerCase() && p.price === price);
      
      if (!plan) {
         plan = await prisma.plan.create({
           data: {
             name: planName,
             price: price,
             billing: dur, // crucial for revenue calculation
             status: 'Active',
             features: JSON.stringify([])
           }
         });
         plans.push(plan);
         console.log(`✅ Created new plan: ${plan.name} at ₹${price}`);
      }

      await prisma.member.update({
        where: { id: m.id },
        data: { planId: plan.id }
      });
      console.log(`🔗 Linked ${m.name} to ${plan.name}`);
    }
  }
}

fix()
  .then(() => console.log('🎉 All members have been linked to their plans!'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
