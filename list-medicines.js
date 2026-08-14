const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const medicines = await prisma.medicine.findMany();
  console.log("Medicines:", JSON.stringify(medicines, null, 2));
}

main()
  .catch(console.error)
  .finally(() => { prisma.$disconnect(); });
