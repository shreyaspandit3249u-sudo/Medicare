const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  console.log(`Setting Vitamin D to ${currentTimeStr}`);
  
  await prisma.medicine.update({
    where: { id: "cmnmwlo1d00005cvcynqx698t" },
    data: { time: currentTimeStr, userId: "cmnot29oq00018gvcbolx0uc0" } // Assigning to a user with a subscription
  });
  
  console.log("Updated successfully.");
}

main()
  .catch(console.error)
  .finally(() => { prisma.$disconnect(); });
