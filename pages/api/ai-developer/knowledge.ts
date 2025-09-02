import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const { userId, systemId, data } = req.body;
    if (!userId || !systemId || typeof data !== "string") {
      return res.status(400).json({ error: "Missing required fields." });
    }
    try {
      const kb = await prisma.knowledgeBase.upsert({
        where: { userId_systemId: { userId, systemId } },
        update: { data },
        create: { userId, systemId, data },
      });
      return res.status(200).json(kb);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update knowledge base." });
    }
  }

  if (req.method === "DELETE") {
    const { userId, systemId } = req.body;
    if (!userId || !systemId) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    try {
      await prisma.knowledgeBase.delete({
        where: { userId_systemId: { userId, systemId } },
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete knowledge base." });
    }
  }

  res.status(405).json({ error: "Method not allowed." });
}
