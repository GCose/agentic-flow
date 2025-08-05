// pages/api/proxy/airo/[id].ts
import axios from "axios";
import https from "https";
import type { NextApiRequest, NextApiResponse } from "next";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Accept self-signed SSL cert (only in dev!)
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  console.log("ID:", id);

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid ID", status: 400 });
  }

  const url = `https://api.ngaagenticflow.agency/warmlead/api/leads/${id}/`;

  try {
    if (req.method === "GET") {
      const response = await axios.get(url, { httpsAgent });
      return res.status(200).json(response.data);
    }

    if (req.method === "DELETE") {
      const response = await axios.delete(url, { httpsAgent });
      return res.status(response.status).json({
        message: "Deleted successfully",
        status: response.status,
        data: response.data || null,
      });
    }

    return res.status(405).json({ message: "Method not allowed", status: 405 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        message: error.message,
        status: error.response?.status || 500,
        details: error.response?.data,
      });
    }

    return res
      .status(500)
      .json({ message: "Unexpected server error", status: 500 });
  }
}
