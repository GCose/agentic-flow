import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

function getUserId(req: NextApiRequest): string | null {
  return req.headers["x-user-id"] as string || null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const userId = getUserId(req);
  const { id } = req.query;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Find notification for user
  const notification = await prisma.notification.findUnique({
    where: { id: id as string },
    include: { users: true, reads: true },
  });
  if (!notification || !notification.users.some(u => u.id === userId)) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  // Add read status for current user
  const isRead = notification.reads.some((r: any) => r.userId === userId);
  res.status(200).json({ notification: { ...notification, isRead } });
}
