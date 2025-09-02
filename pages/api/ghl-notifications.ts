import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Only return notifications for GHL
    const notifications = await prisma.notification.findMany({
      where: { type: "ghl" },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(notifications);
  }
  return res.status(405).json({ error: "Method not allowed" });
}
