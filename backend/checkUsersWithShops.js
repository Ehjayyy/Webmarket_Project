import prisma from "./src/lib/prisma.js";

async function checkUsersWithShops() {
  try {
    console.log("Checking users with shops...");
    
    const usersWithShops = await prisma.user.findMany({
      include: {
        shops: true
      }
    });
    
    console.log("\nUsers with shops:");
    usersWithShops.forEach(user => {
      console.log(`\nUser ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      if (user.shops.length > 0) {
        console.log(`Shops: ${user.shops.length}`);
        user.shops.forEach(shop => {
          console.log(`  - ${shop.shop_name}`);
        });
      } else {
        console.log("Shops: 0");
      }
    });
    
  } catch (error) {
    console.error("Error checking users with shops:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsersWithShops();
