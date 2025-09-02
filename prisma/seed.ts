import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create overall admin if not exists
  // Seed sample systems
  const leadgenSystem = await prisma.system.upsert({
    where: { name: "Leadgen" },
    update: {},
    create: { name: "Leadgen" }
  });
  const contentSystem = await prisma.system.upsert({
    where: { name: "Sales" },
    update: {},
    create: { name: "Sales  " }
  });

  // Seed sample clients
  const client1 = await prisma.user.upsert({
    where: { email: "client1@acme.com" },
    update: {},
    create: {
      name: "Acme Corp",
      email: "client1@acme.com",
      password: await bcrypt.hash("client1@123", 10),
      role: "client"
    }
  });
  const client2 = await prisma.user.upsert({
    where: { email: "client2@beta.com" },
    update: {},
    create: {
      name: "Beta LLC",
      email: "client2@beta.com",
      password: await bcrypt.hash("client2@123", 10),
      role: "client"
    }
  });

  // Assign systems to clients
  await prisma.userSystem.upsert({
    where: { userId_systemId: { userId: client1.id, systemId: leadgenSystem.id } },
    update: {},
    create: { userId: client1.id, systemId: leadgenSystem.id }
  });
  await prisma.userSystem.upsert({
    where: { userId_systemId: { userId: client1.id, systemId: contentSystem.id } },
    update: {},
    create: { userId: client1.id, systemId: contentSystem.id }
  });
  await prisma.userSystem.upsert({
    where: { userId_systemId: { userId: client2.id, systemId: contentSystem.id } },
    update: {},
    create: { userId: client2.id, systemId: contentSystem.id }
  });

  // Seed knowledge base data
  await prisma.knowledgeBase.upsert({
    where: { userId_systemId: { userId: client1.id, systemId: leadgenSystem.id } },
    update: { data: "Lead generation best practices and client-specific tweaks." },
    create: {
      userId: client1.id,
      systemId: leadgenSystem.id,
      data: "Lead generation best practices and client-specific tweaks."
    }
  });
  await prisma.knowledgeBase.upsert({
    where: { userId_systemId: { userId: client1.id, systemId: contentSystem.id } },
    update: { data: "Content creation guidelines and client preferences." },
    create: {
      userId: client1.id,
      systemId: contentSystem.id,
      data: "Content creation guidelines and client preferences."
    }
  });
  await prisma.knowledgeBase.upsert({
    where: { userId_systemId: { userId: client2.id, systemId: contentSystem.id } },
    update: { data: "Content creation guidelines and client preferences." },
    create: {
      userId: client2.id,
      systemId: contentSystem.id,
      data: "Content creation guidelines and client preferences."
    }
  });
  const adminEmail = "admin@agenticflow.gm";
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash("nextgen@123", 10);
    await prisma.user.create({
      data: {
        name: "AgenticFlow Admin",
        email: adminEmail,
        password: hashedPassword, // Change this after first login
        role: "admin"
      }
    });
    console.log("Admin user seeded.");
  } else {
    console.log("Admin user already exists.");
  }

  // Create designer if not exists
  const designerEmail = "designer@agenticflow.gm";
  const designer = await prisma.user.findUnique({ where: { email: designerEmail } });
  if (!designer) {
    const hashedPassword = await bcrypt.hash("designer@123", 10);
    await prisma.user.create({
      data: {
        name: "Designer User",
        email: designerEmail,
        password: hashedPassword,
        role: "designer"
      }
    });
    console.log("Designer user seeded.");
  } else {
    console.log("Designer user already exists.");
  }

  // Create videographer if not exists
  const videoEmail = "video@agenticflow.gm";
  const videographer = await prisma.user.findUnique({ where: { email: videoEmail } });
  if (!videographer) {
    const hashedPassword = await bcrypt.hash("video@123", 10);
    await prisma.user.create({
      data: {
        name: "Videographer User",
        email: videoEmail,
        password: hashedPassword,
        role: "videographer"
      }
    });
    console.log("Videographer user seeded.");
  } else {
    console.log("Videographer user already exists.");
  }
  const ghlEmail = "ghl@agenticflow.gm";
  const ghlAdmin = await prisma.user.findUnique({ where: { email: ghlEmail } });
  if (!ghlAdmin) {
    const hashedPassword = await bcrypt.hash("ghladmin@123", 10);
    await prisma.user.create({
      data: {
        name: "GHL Admin",
        email: ghlEmail,
        password: hashedPassword,
        role: "ghl_admin"
      }
    });
    console.log("GHL admin user seeded.");
  } else {
    console.log("GHL admin user already exists.");
  }

  // Create AI Developer if not exists
  const aiDevEmail = "aidev@agenticflow.gm";
  const aiDeveloper = await prisma.user.findUnique({ where: { email: aiDevEmail } });
  if (!aiDeveloper) {
    const hashedPassword = await bcrypt.hash("aidev@123", 10);
    await prisma.user.create({
      data: {
        name: "AI Developer",
        email: aiDevEmail,
        password: hashedPassword,
        role: "ai_developer"
      }
    });
    console.log("AI Developer user seeded.");
  } else {
    console.log("AI Developer user already exists.");
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
