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
    const { name, email, password, currentPassword } = req.body;
    try {
      let updateData: any = {};
      const bcrypt = require("bcryptjs");
      // Require current password for email changes
      if (email) {
        if (!currentPassword) {
          return res.status(400).json({ error: "Current password required to change email" });
        }
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }
        updateData.email = email;
      }
      if (name) updateData.name = name;
      if (password) {
        // Password strength validation
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!strongRegex.test(password)) {
          return res.status(400).json({ error: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol" });
        }
        const hashed = await bcrypt.hash(password, 10);
        updateData.password = hashed;
      }
      const user = await prisma.user.update({
        where: { id },
        data: updateData
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
