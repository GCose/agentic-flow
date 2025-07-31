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
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed", status: 405 });
  }

  const { id } = req.query;
  console.log("IDee", id);

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid ID", status: 400 });
  }

  try {
    const response = await axios.get(
      `https://178.63.40.80:5500/api/leads/${id}/`,
      { httpsAgent }
    );
    res.status(200).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        message: error.message,
        status: error.response?.status || 500,
        details: error.response?.data,
      });
    } else {
      res.status(500).json({ message: "Unexpected server error", status: 500 });
    }
  }
}
