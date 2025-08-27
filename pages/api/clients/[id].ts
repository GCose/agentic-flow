import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid client id" });
  }

  if (req.method === "GET") {
    // Get client with systems
    const client = await prisma.user.findUnique({
      where: { id },
      include: { systems: { include: { system: true } } }
    });
    if (!client) return res.status(404).json({ error: "Client not found" });
    return res.status(200).json(client);
  }

  if (req.method === "PUT") {
    // Update client systems
    const { systems } = req.body; // systems: array of system names
    if (!Array.isArray(systems)) {
      return res.status(400).json({ error: "Systems must be an array" });
    }
    // Find or create systems
    const systemRecords = await Promise.all(
      systems.map(async (name: string) => {
        let sys = await prisma.system.findUnique({ where: { name } });
        if (!sys) {
          sys = await prisma.system.create({ data: { name } });
        }
        return sys;
      })
    );
    // Remove all current systems for user
    await prisma.userSystem.deleteMany({ where: { userId: id } });
    // Add new systems
    await prisma.user.update({
      where: { id },
      data: {
        systems: {
          create: systemRecords.map((sys) => ({ systemId: sys.id }))
        }
      }
    });
    // Return updated client
    const updated = await prisma.user.findUnique({
      where: { id },
      include: { systems: { include: { system: true } } }
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.user.delete({ where: { id } });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
