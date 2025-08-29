import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // List all systems
    const systems = await prisma.system.findMany();
    return res.status(200).json(systems);
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "System name required" });
    }
    // Check for duplicate
    const existing = await prisma.system.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "System already exists" });
    }
    const system = await prisma.system.create({ data: { name } });
    return res.status(201).json(system);
  }

  if (req.method === "DELETE") {
    let { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "System name required" });
    }
    // Normalize name: trim and case-insensitive search
    name = name.trim().toLowerCase();
    const allSystems = await prisma.system.findMany();
    const system = allSystems.find(s => s.name.trim().toLowerCase() === name);
    console.log("[DELETE] Requested system name:", name);
    console.log("[DELETE] Found system:", system);
    if (!system) {
      console.log("[DELETE] System not found.");
      return res.status(404).json({ error: `System '${name}' not found` });
    }
    try {
      await prisma.userSystem.deleteMany({ where: { systemId: system.id } });
      await prisma.system.delete({ where: { id: system.id } });
      console.log("[DELETE] System deleted:", system.id);
      return res.status(204).end();
    } catch (err) {
      console.log("[DELETE] Error:", err);
      return res.status(500).json({ error: "Failed to delete system", details: String(err) });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
