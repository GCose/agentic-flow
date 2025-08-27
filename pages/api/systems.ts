import type { NextApiRequest, NextApiResponse } from "next";

// Example static systems API route for Next.js
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // These are the systems offered by Agentic Flow
  const systems = [
    { name: "Content" },
    { name: "LeadGen" },
    { name: "Sales" },
    { name: "Onboarding" }
  ];
  res.status(200).json(systems);
}
