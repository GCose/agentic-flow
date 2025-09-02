import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get all clients and their systems
    const clients = await prisma.user.findMany({
      where: { role: "client" },
      select: {
        id: true,
        name: true,
        email: true,
        systems: {
          select: {
            system: {
              select: { id: true, name: true }
            }
          }
        },
        knowledgeBases: {
          select: {
            systemId: true,
            system: { select: { name: true } },
            data: true,
            updatedAt: true,
          }
        }
      }
    });

    // Format response with dynamic knowledge base
    const result = clients.map(client => {
      // Map system name to knowledge base data
      const knowledge: Record<string, string> = {};
      client.systems.forEach(s => {
        const kb = client.knowledgeBases.find(k => k.systemId === s.system.id);
        knowledge[s.system.name] = kb
          ? `${kb.data}\n\nLast updated: ${kb.updatedAt.toISOString()}`
          : "No knowledge base available.";
      });
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        systems: client.systems.map(s => s.system.name),
        knowledge,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch clients." });
  }
}
