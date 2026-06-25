import prisma from './src/prisma.js';

async function test() {
  try {
    const member = await prisma.member.findFirst();
    if (!member) {
      console.log("No members found");
      return;
    }
    console.log("Found member:", member.id);

    const newLog = await prisma.progressLog.create({
      data: {
        memberId: member.id,
        weight: 75.5,
        bmi: 24.5,
        notes: "Test log",
        date: new Date(),
      }
    });
    console.log("Created progress log:", newLog);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
