import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid member id" });
  }

  switch (method) {
    case "PUT": {
      // Update member
      const { name, email, role } = body;
      try {
        const updated = await prisma.user.update({
          where: { id },
          data: { name, email, role },
        });
        return res.status(200).json(updated);
      } catch {
        return res.status(500).json({ error: "Failed to update member" });
      }
    }
    case "DELETE": {
      try {
        await prisma.user.delete({ where: { id } });
        return res.status(204).end();
      } catch {
        return res.status(500).json({ error: "Failed to delete member" });
      }
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
