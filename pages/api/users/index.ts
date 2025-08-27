/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // List all users (no passwords)
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
    });
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    // Create a new user
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const createdUser = await prisma.user.create({
        data: { name, email, password, role }
      });
      const { password: userPassword, ...userData } = createdUser;
      return res.status(201).json(userData);
    } catch (err) {
      return res.status(500).json({ error: "Could not create user", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
