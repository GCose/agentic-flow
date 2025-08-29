import type { NextApiRequest, NextApiResponse } from "next";

// In-memory store for demo purposes. Replace with DB in production.
const pendingAccounts: Array<{
  name: string;
  email: string;
  systems: string[];
  createdAt: string;
}> = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, systems } = req.body;
    if (!name || !email || !Array.isArray(systems)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const account = {
      name,
      email,
      systems,
      createdAt: new Date().toISOString(),
    };
    pendingAccounts.unshift(account);
    return res.status(201).json(account);
  }

  if (req.method === "GET") {
    return res.status(200).json(pendingAccounts);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
