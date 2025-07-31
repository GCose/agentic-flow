// pages/api/proxy/airo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // ⚠️ Ignore self-signed cert errors
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get("https://178.63.40.80:5500/api/leads/", {
      httpsAgent,
    });

    res.status(200).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("🔥 Proxy error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });

      res.status(500).json({
        error: "Proxy failed",
        details: error.message,
      });
    } else if (error instanceof Error) {
      console.error("🔥 Proxy error:", {
        message: error.message,
      });

      res.status(500).json({
        error: "Proxy failed",
        details: error.message,
      });
    } else {
      console.error("🔥 Proxy error:", { error });

      res.status(500).json({
        error: "Proxy failed",
        details: "Unknown error",
      });
    }
  }
}
