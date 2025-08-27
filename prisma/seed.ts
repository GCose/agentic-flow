import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create overall admin if not exists
  const adminEmail = "admin@agenticflow.gm";
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash("nextgen@123", 10);
    await prisma.user.create({
      data: {
        name: "NextGen Agency",
        email: adminEmail,
        password: hashedPassword, // Change this after first login
        role: "admin"
      }
    });
    console.log("Admin user seeded.");
  } else {
    console.log("Admin user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
