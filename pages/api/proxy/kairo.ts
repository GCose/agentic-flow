// pages/api/proxy/airo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import https from "https";
import { loggedInUser } from "../../../utils/auth";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // ⚠️ Ignore self-signed cert errors
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let client_id = req.query.client_id;
  if (!client_id || Array.isArray(client_id)) {
    // Try to get from logged-in user
    const user = typeof window !== "undefined" ? loggedInUser() : null;
    client_id = user?.id;
  }
  if (!client_id) {
    return res.status(400).json({ error: "Invalid client_id", status: 400 });
  }
  const url = `https://api.ngaagenticflow.agency/audits/api/${client_id}/audits/`;

  try {
    const response = await axios.get(url, { httpsAgent });
    res.status(200).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("🔥 Proxy error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      res.status(error.response?.status || 500).json({
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
