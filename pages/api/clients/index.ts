import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const clients = await prisma.user.findMany({
      where: { role: "client" },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    return res.status(200).json(clients);
  }

  if (req.method === "POST") {
    const { name, email, password, description, systems } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      // Create client
      const client = await prisma.user.create({
        data: { name, email, password, role: "client" }
      });
      // Attach systems if provided
      if (Array.isArray(systems) && systems.length > 0) {
        const systemRecords = await Promise.all(
          systems.map(async (name: string) => {
            let sys = await prisma.system.findUnique({ where: { name } });
            if (!sys) {
              sys = await prisma.system.create({ data: { name } });
            }
            return sys;
          })
        );
        await prisma.user.update({
          where: { id: client.id },
          data: {
            systems: {
              create: systemRecords.map((sys) => ({ systemId: sys.id }))
            }
          }
        });
      }
      // Return client with systems
      const clientWithSystems = await prisma.user.findUnique({
        where: { id: client.id },
        include: { systems: { include: { system: true } } }
      });
      return res.status(201).json(clientWithSystems);
    } catch (err) {
      return res.status(500).json({ error: "Could not create client", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
