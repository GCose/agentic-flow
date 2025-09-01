
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, systems } = req.body;
    if (!name || !email || !Array.isArray(systems)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const account = await prisma.pendingAccount.create({
        data: {
          name,
          email,
          systems,
        },
      });
      return res.status(201).json(account);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create pending account" });
    }
  }

  if (req.method === "GET") {
    try {
      const accounts = await prisma.pendingAccount.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(accounts);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch pending accounts" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
