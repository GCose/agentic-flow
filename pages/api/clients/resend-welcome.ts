import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { clientId } = req.body;
  if (!clientId) {
    return res.status(400).json({ error: "Missing clientId" });
  }
  const client = await prisma.user.findUnique({ where: { id: clientId } });
  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }
  // Reuse tokens if present, else generate new
  const setupToken = client.setupToken || crypto.randomBytes(32).toString("hex");
  const verifyToken = client.verifyToken || crypto.randomBytes(32).toString("hex");
  // Send email
  let status = 'sent';
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || "youruser",
        pass: process.env.SMTP_PASS || "yourpass",
      },
    });
    const html = `<div style="font-family:Arial,sans-serif;background:#f8fafc;padding:32px;border-radius:12px;max-width:600px;margin:auto;">
      <h1 style="color:#2563eb;">Welcome, ${client.name}!</h1>
      <p>Your account has been created. To get started, please set your password and verify your email:</p>
      <a href="${process.env.APP_URL}/setup-password?token=${setupToken}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Set Your Password</a>
      <p>After setting your password, verify your email:</p>
      <a href="${process.env.APP_URL}/verify-email?token=${verifyToken}" style="display:inline-block;padding:12px 24px;background:#22c55e;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Verify Email</a>
      <hr style="margin:24px 0;">
      <p>Login at <a href="${process.env.APP_URL}/login">Agentic Flow</a></p>
      <p>Need help? <a href="mailto:support@agenticflow.com">Contact Support</a></p>
      <p style="font-size:12px;color:#888;">If you did not request this account, please ignore this email.</p>
    </div>`;
    await transporter.sendMail({
      from: '"Agentic Flow" <no-reply@agenticflow.com>',
      to: client.email,
      subject: "Welcome to Agentic Flow!",
      html,
    });
  } catch (err) {
    status = 'failed';
  }
  await prisma.user.update({ where: { id: client.id }, data: { emailStatus: status, setupToken, verifyToken } });
  return res.status(200).json({ success: true, status });
}