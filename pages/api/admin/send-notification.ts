import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import prisma from '../../../lib/prisma';
import nodemailer from 'nodemailer';


// Dummy delivery status and scheduling logic for demonstration
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable();
  form.parse(req, async (err: any, fields: formidable.Fields, files: formidable.Files) => {
    if (err) {
      return res.status(400).json({ error: 'Form parse error' });
    }
    // Extract fields
  // Formidable fields are arrays, extract first value
  const title = Array.isArray(fields.title) ? fields.title[0] : fields.title || "";
  const message = Array.isArray(fields.message) ? fields.message[0] : fields.message || ""; 
  const sendType = Array.isArray(fields.sendType) ? fields.sendType[0] : fields.sendType || "";
  const targetGroup = Array.isArray(fields.targetGroup) ? fields.targetGroup[0] : fields.targetGroup || "";
  const schedule = Array.isArray(fields.schedule) ? fields.schedule[0] : fields.schedule;
  const testMode = Array.isArray(fields.testMode) ? fields.testMode[0] : fields.testMode;
  const selectedUsers = Array.isArray(fields.selectedUsers) ? fields.selectedUsers[0] : fields.selectedUsers;
  const targetClients = Array.isArray(fields.targetClients) ? fields.targetClients[0] : fields.targetClients;
  const mandatory = Array.isArray(fields.mandatory) ? fields.mandatory[0] : fields.mandatory;
    let attachmentUrl = null;
    if (files.attachment) {
      const fileArr = Array.isArray(files.attachment) ? files.attachment : [files.attachment];
      const file = fileArr[0];
      if (file) {
        const data = fs.readFileSync(file.filepath);
        const savePath = `/tmp/${file.originalFilename}`;
        fs.writeFileSync(savePath, data);
        attachmentUrl = savePath;
      }
    }

    // Find target users
    let users = [];
    // Try with notificationEnabled, fallback to without if error
    try {
      if (testMode === 'true') {
        users = await prisma.user.findMany({ where: { role: 'admin', notificationEnabled: true } });
      } else if (selectedUsers && selectedUsers !== '') {
        let emails: string[] = [];
        try {
          emails = JSON.parse(selectedUsers);
        } catch {
          emails = selectedUsers.split(',').map((e: string) => e.trim()).filter(Boolean);
        }
        users = await prisma.user.findMany({ where: { email: { in: emails }, notificationEnabled: true } });
      } else if (targetGroup === 'clients') {
        if (targetClients && targetClients.length > 0) {
          let emails: string[] = [];
          if (Array.isArray(targetClients)) {
            emails = targetClients;
          } else if (typeof targetClients === 'string') {
            emails = targetClients.split(',').map((e: string) => e.trim()).filter(Boolean);
          }
          users = await prisma.user.findMany({ where: { email: { in: emails }, role: 'client' } });
        } else {
          users = await prisma.user.findMany({ where: { role: 'client' } });
        }
      } else if (targetGroup === 'admins') {
        users = await prisma.user.findMany({ where: { role: 'admin' } });
      } else {
        users = await prisma.user.findMany({});
      }
    } catch {
      if (testMode === 'true') {
        users = await prisma.user.findMany({ where: { role: 'admin' } });
      } else if (selectedUsers && selectedUsers !== '') {
        let emails: string[] = [];
        try {
          emails = JSON.parse(selectedUsers);
        } catch {
          emails = selectedUsers.split(',').map((e: string) => e.trim()).filter(Boolean);
        }
        users = await prisma.user.findMany({ where: { email: { in: emails } } });
      } else if (targetGroup === 'clients') {
        if (targetClients && targetClients.length > 0) {
          let emails: string[] = [];
          if (Array.isArray(targetClients)) {
            emails = targetClients;
          } else if (typeof targetClients === 'string') {
            emails = targetClients.split(',').map((e: string) => e.trim()).filter(Boolean);
          }
          users = await prisma.user.findMany({ where: { email: { in: emails }, role: 'client' } });
        } else {
          users = await prisma.user.findMany({ where: { role: 'client' } });
        }
      } else if (targetGroup === 'admins') {
        users = await prisma.user.findMany({ where: { role: 'admin' } });
      } else {
        users = await prisma.user.findMany({});
      }
    }

    // If not mandatory, filter out users with notifications disabled
    if (!mandatory) {
      users = users.filter((u: any) => u.notificationEnabled !== false);
    }

    // Save notification
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        sendType,
        targetGroup,
        schedule: schedule ? new Date(schedule) : undefined,
        status: schedule && schedule !== '' ? 'Scheduled' : 'Sent',
        attachment: attachmentUrl,
        users: {
          connect: (users as { id: string }[]).map(u => ({ id: u.id }))
        }
      }
    });

    // Send email to each user (basic example)
    // You should configure your SMTP credentials in environment variables
  const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'youruser',
        pass: process.env.SMTP_PASS || 'yourpass',
      },
    });

    for (const user of users) {
      if (user.email) {
        await transporter.sendMail({
          from: 'no-reply@agenticflow.com',
          to: user.email,
          subject: `[Agentic Flow] ${title}`,
          html: `<div style="font-family:Arial,sans-serif;background:#f8fafc;padding:32px;border-radius:12px;max-width:600px;margin:auto;"><h2 style="color:#2563eb;">${title}</h2><p>${message}</p></div>`
        });
      }
    }

    return res.status(200).json({ message: schedule && schedule !== '' ? 'Notification scheduled.' : 'Notification sent to users.', status: notification.status, attachment: attachmentUrl });
  });
}

export default handler;
