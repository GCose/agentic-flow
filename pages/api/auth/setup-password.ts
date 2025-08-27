import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: "Missing token or password" });
  }
  // Password strength validation
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!strongRegex.test(password)) {
    return res.status(400).json({ error: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol." });
  }
  const user = await prisma.user.findFirst({ where: { setupToken: token } });
  if (!user) {
    return res.status(404).json({ error: "Invalid or expired token" });
  }
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, setupToken: null }
  });
  return res.status(200).json({ success: true, message: "Password set successfully." });
}
