import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { userId, email, name, currentPassword, newPassword } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Change name and/or email only
  if ((email || name) && !newPassword) {
    const updateData: any = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    const updated = await prisma.user.update({ where: { id: userId }, data: updateData });
    return res.status(200).json({ success: true, message: "Profile updated", user: updated });
  }

  // Change password
  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ error: "Current password required" });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: "Current password is incorrect" });
    if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return res.status(200).json({ success: true, message: "Password updated" });
  }

  return res.status(400).json({ error: "No update performed" });
}
