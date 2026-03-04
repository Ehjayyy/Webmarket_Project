import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Connected to database successfully ✅");
  console.log("Users found:", users);
  
  const categories = await prisma.category.findMany();
  console.log("\nCategories found:", categories);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });