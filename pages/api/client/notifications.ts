import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Dummy auth for demo; replace with real session/user logic
function getUserId(req: NextApiRequest): string | null {
  // Example: extract user ID from session/cookie
  return req.headers["x-user-id"] as string || null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Get notifications for user
  // Get notifications for user
  const notifications = await prisma.notification.findMany({
    where: {
      users: {
        some: { id: userId }
      }
    },
    include: {
      reads: true
    },
    orderBy: { createdAt: 'desc' }
  });
  // Mark read status for each notification
  const notificationsWithRead = notifications.map((n: any) => ({
    ...n,
    isRead: n.reads.some((r: any) => r.userId === userId)
  }));
  const unreadCount = notificationsWithRead.filter((n: any) => !n.isRead).length;
  res.status(200).json({ notifications: notificationsWithRead, unreadCount });
}
