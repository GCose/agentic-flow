import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanClientPasswords() {
  // Find all clients with a non-null password
  // Use raw SQL to find clients with non-null and non-empty passwords
  const clients = await prisma.$queryRaw<{ id: string; email: string }[]>`SELECT id, email FROM "User" WHERE role = 'client' AND password IS NOT NULL AND password <> ''`;

  for (const client of clients) {
    // Set password to empty string for each client
    await prisma.user.update({
      where: { id: client.id },
      data: { password: "" },
    });
    console.log(`Updated client ${client.email}: password set to empty string.`);
  }

  console.log("Client password cleanup complete.");
}

cleanClientPasswords()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
