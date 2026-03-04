import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories...");

  const categories = [
    { name: "Electronics" },
    { name: "Clothing" },
    { name: "Home & Kitchen" },
    { name: "Sports & Outdoors" },
    { name: "Books" },
    { name: "Beauty & Health" },
    { name: "Toys & Games" },
    { name: "Automotive" },
  ];

  for (const category of categories) {
    // Check if category exists
    const existing = await prisma.category.findFirst({
      where: { name: category.name },
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
    }
  }

  console.log("✅ Categories seeded successfully!");

  // Create test admin user
  const adminEmail = "admin@marketplace.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@marketplace.com");
    console.log("Password: admin123");
  }

  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
