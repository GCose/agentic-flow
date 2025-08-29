/* eslint-disable @typescript-eslint/no-unused-vars */


import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, password, setupToken } = req.body;
  if (!email || (!password && !setupToken)) {
    return res.status(400).json({ error: "Missing email or password/setup token" });
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: { systems: { include: { system: true } } }
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // If password is provided, check password
  if (password && user.password) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: userPassword, systems, ...userData } = user;
    // Flatten systems for client
    const systemNames = Array.isArray(systems) ? systems.map((us: any) => us.system?.name) : [];
    return res.status(200).json({ ...userData, systems: systemNames });
  }
  // If setupToken is provided, check setupToken for passwordless onboarding
  if (setupToken && user.setupToken && setupToken === user.setupToken) {
  const { password: userPassword, systems, ...userData } = user;
  const systemNames = Array.isArray(systems) ? systems.map((us: any) => us.system?.name) : [];
  return res.status(200).json({ ...userData, systems: systemNames });
  }
  return res.status(401).json({ error: "Invalid credentials" });
}
