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
  const { client_id, lead_id } = req.query;
  console.log("Proxy airo.ts - client_id:", client_id, "lead_id:", lead_id);

  if (!client_id || Array.isArray(client_id)) {
    return res.status(400).json({ error: "Invalid client_id", status: 400 });
  }

  let url = `https://api.ngaagenticflow.agency/warmlead/api/${client_id}/leads/`;
  if (lead_id && !Array.isArray(lead_id)) {
    url += `${lead_id}/`;
  }
  console.log("Proxy airo.ts - final URL:", url);

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
