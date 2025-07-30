// pages/api/proxy/kairo/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing lead ID" });
  }

  try {
    const response = await axios.get(
      `https://178.63.40.80:5600/api/audits/${id}/`,
      { httpsAgent }
    );
    res.status(200).json(response.data);
  } catch (error: unknown) {
    let message = "Unknown error";
    let status = undefined;
    let responseData = undefined;

    if (axios.isAxiosError(error)) {
      message = error.message;
      status = error.response?.status;
      responseData = error.response?.data;
    } else if (error instanceof Error) {
      message = error.message;
    }

    console.error("🔥 Proxy lead error:", {
      message,
      status,
      response: responseData,
    });
    res.status(500).json({
      error: "Failed to fetch lead",
      details: message,
    });
  }
}
