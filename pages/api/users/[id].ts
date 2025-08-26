import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user id" });
  }

  if (req.method === "GET") {
    // Get user by id (no password)
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  }

  if (req.method === "PUT") {
    // Update user info
    const { name, email, password } = req.body;
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { name, email, ...(password ? { password } : {}) }
      });
      const { password: _, ...userData } = user;
      return res.status(200).json(userData);
    } catch (err) {
      return res.status(500).json({ error: "Could not update user", details: err });
    }
  }

  if (req.method === "DELETE") {
    // Delete user
    try {
      await prisma.user.delete({ where: { id } });
      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ error: "Could not delete user", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
