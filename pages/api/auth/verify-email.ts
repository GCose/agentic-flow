import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }
  const user = await prisma.user.findFirst({ where: { verifyToken: token } });
  if (!user) {
    return res.status(404).json({ error: "Invalid or expired token" });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null }
  });
  return res.status(200).json({ success: true, message: "Email verified successfully." });
}
