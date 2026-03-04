import prisma from "./src/lib/prisma.js";

async function fixUserRoles() {
  try {
    console.log("Fixing user roles...");
    
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      if (user.role && user.role !== user.role.toUpperCase()) {
        console.log(`Updating user ${user.id} (${user.email}) from ${user.role} to ${user.role.toUpperCase()}`);
        await prisma.user.update({
          where: { id: user.id },
          data: { role: user.role.toUpperCase() }
        });
      }
    }
    
    console.log("User roles fixed successfully!");
    
    // Verify the changes
    const updatedUsers = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    console.log("\nUpdated users:");
    console.log(updatedUsers);
    
  } catch (error) {
    console.error("Error fixing user roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRoles();
