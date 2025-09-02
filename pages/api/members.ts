

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Exclude clients from members list
    const members = await prisma.user.findMany({
      where: {
        NOT: { role: "client" }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { createdAt: "desc" }
    });
    return res.status(200).json(members);
  }

  if (req.method === "POST") {
    const { name, email, role, password } = req.body;
    if (!name || !email || !role || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      // Generate secure tokens
      const setupToken = crypto.randomBytes(32).toString("hex");
      const verifyToken = crypto.randomBytes(32).toString("hex");
      // Create member with tokens and unverified status
      const member = await prisma.user.create({
        data: {
          name,
          email,
          password: "", // password will be set via setup-password endpoint
          role,
          setupToken,
          verifyToken,
          verified: false,
        }
      });
      // Send welcome email with setup/verify links
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.example.com",
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER || "youruser",
          pass: process.env.SMTP_PASS || "yourpass",
        },
      });
      const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 0; margin: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
            <tr>
              <td style="background:#2563eb;padding:32px 24px 16px 24px;text-align:center;">
                <h1 style="color:#fff;font-size:2rem;margin:0 0 8px 0;">Welcome to Agentic Flow, ${name}!</h1>
                <p style="color:#e0e7ff;font-size:1.1rem;margin:0;">We're excited to have you onboard.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px 16px 24px;">
                <p style="font-size:1.1rem;color:#222;margin-bottom:18px;">Here's how to get started:</p>
                <div style="margin-bottom:24px;">
                  <a href="${process.env.APP_URL}/setup-password?token=${setupToken}" style="display:inline-block;padding:14px 32px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem;margin-bottom:12px;">Set Your Password</a><br>
                  <a href="${process.env.APP_URL}/verify-email?token=${verifyToken}" style="display:inline-block;padding:14px 32px;background:#22c55e;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem;margin-bottom:12px;">Verify Email</a><br>
                  <a href="${process.env.APP_URL}/login" style="display:inline-block;padding:14px 32px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem;">Login to Agentic Flow</a>
                </div>
                <div style="background:#f1f5f9;padding:18px;border-radius:8px;margin-bottom:18px;">
                  <h2 style="color:#2563eb;font-size:1.2rem;margin:0 0 8px 0;">Passwordless Login</h2>
                  <p style="color:#222;font-size:1rem;margin:0;">You can also log in using your setup token from this email. Just paste it in the login form if you prefer passwordless access.</p>
                  <div style="background:#e0e7ff;color:#2563eb;padding:8px 12px;border-radius:6px;margin-top:8px;font-size:0.95rem;word-break:break-all;">${setupToken}</div>
                </div>
                <hr style="margin:24px 0;">
                <h2 style="color:#2563eb;font-size:1.1rem;margin-bottom:8px;">Get Started Resources</h2>
                <ul style="margin-bottom:16px;padding-left:18px;">
                  <li><a href="${process.env.APP_URL}/docs" style="color:#2563eb;">Documentation</a></li>
                  <li><a href="${process.env.APP_URL}/tutorials" style="color:#2563eb;">Video Tutorials</a></li>
                  <li><a href="${process.env.APP_URL}/support" style="color:#2563eb;">Support Center</a></li>
                </ul>
                <p style="margin-bottom:8px;color:#222;">Need help? <a href="mailto:support@agenticflow.com" style="color:#2563eb;">Contact Support</a></p>
                <p style="font-size:12px;color:#888;">If you did not request this account, please ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;padding:18px;text-align:center;font-size:12px;color:#888;border-radius:0 0 16px 16px;">&copy; ${new Date().getFullYear()} Agentic Flow. All rights reserved.</td>
            </tr>
          </table>
        </div>
      `;
      await transporter.sendMail({
        from: 'Agentic Flow <francismariogomez@gmail.com>',
        to: email,
        subject: 'Welcome to Agentic Flow!',
        html,
      });
      return res.status(201).json({ success: true, member });
    } catch (err) {
      return res.status(500).json({ error: "Could not create member", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
