import { NextApiRequest, NextApiResponse } from 'next';
import { getAssistantSettings, updateAssistantSettings, resetAssistantSettings } from "@/lib/appointments";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const settings = getAssistantSettings();
        return res.status(200).json(settings);

      case 'PUT':
        const updates = req.body;
        const updatedSettings = updateAssistantSettings(updates);
        return res.status(200).json(updatedSettings);

      case 'DELETE':
        const resetSettings = resetAssistantSettings();
        return res.status(200).json(resetSettings);

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Assistant settings API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
