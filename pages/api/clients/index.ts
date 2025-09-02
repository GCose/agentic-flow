// Onboarding analytics event logging
async function logOnboardingEvent(userId: string, event: string, details?: string) {
  await prisma.onboardingEvent.create({
    data: {
      userId,
      event,
      details,
      timestamp: new Date(),
    }
  });
}
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // DELETE: Remove one or more clients
  if (req.method === "DELETE") {
    let body = req.body;
    // Next.js does not parse body for DELETE, so handle string case
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }
    const { id, ids } = body;
    try {
      if (Array.isArray(ids) && ids.length > 0) {
        // Bulk delete: clean up related records first
        await prisma.userSystem.deleteMany({ where: { userId: { in: ids } } });
        await prisma.onboardingEvent.deleteMany({ where: { userId: { in: ids } } });
        await prisma.notificationRead.deleteMany({ where: { userId: { in: ids } } });
        // Delete users
        await prisma.user.deleteMany({
          where: {
            id: { in: ids },
            role: "client",
          },
        });
        return res.status(200).json({ success: true, message: `Deleted ${ids.length} clients.` });
      } else if (id) {
        // Single delete: clean up related records first
        await prisma.userSystem.deleteMany({ where: { userId: id } });
        await prisma.onboardingEvent.deleteMany({ where: { userId: id } });
        await prisma.notificationRead.deleteMany({ where: { userId: id } });
        await prisma.user.delete({
          where: { id },
        });
        return res.status(200).json({ success: true, message: "Client deleted." });
      } else {
        return res.status(400).json({ error: "Missing id or ids for deletion." });
      }
    } catch (err) {
      return res.status(500).json({ error: "Could not delete client(s)", details: err });
    }
  }
  async function sendWelcomeEmail(email: string, name: string, setupToken: string, verifyToken: string) {
    let status = 'sent';
    let errorDetails = '';
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com", // Set in .env
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || "youruser",
        pass: process.env.SMTP_PASS || "yourpass",
      },
    });

    // Basic internationalization (English/Spanish)
    const lang = process.env.ONBOARDING_EMAIL_LANG || 'en';
    let html = '';
    if (lang === 'es') {
      html = `
        <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:32px;border-radius:12px;max-width:600px;margin:auto;">
          <img src='${process.env.APP_URL}/images/icon.png' alt='Agentic Flow Logo' style='height:48px;margin-bottom:16px;'>
          <h1 style="color:#2563eb;">¡Bienvenido a Agentic Flow, ${name}!</h1>
          <p style="font-size:16px;">Estamos emocionados de tenerte. Aquí tienes cómo empezar:</p>
          <ol style="margin:16px 0 24px 24px;font-size:15px;">
            <li>Establece tu contraseña: <a href="${process.env.APP_URL}/setup-password?token=${setupToken}" style="color:#2563eb;font-weight:bold;">Establecer contraseña</a></li>
            <li>Verifica tu correo: <a href="${process.env.APP_URL}/verify-email?token=${verifyToken}" style="color:#22c55e;font-weight:bold;">Verificar correo</a></li>
            <li>Accede: <a href="${process.env.APP_URL}/login" style="color:#2563eb;font-weight:bold;">Inicio de sesión</a></li>
          </ol>
          <hr style="margin:24px 0;">
          <h2 style="color:#2563eb;font-size:18px;margin-bottom:8px;">Recursos para empezar</h2>
          <ul style="margin-bottom:16px;">
            <li><a href="${process.env.APP_URL}/docs" style="color:#2563eb;">Documentación</a></li>
            <li><a href="${process.env.APP_URL}/tutorials" style="color:#2563eb;">Tutoriales en video</a></li>
            <li><a href="${process.env.APP_URL}/support" style="color:#2563eb;">Centro de soporte</a></li>
          </ul>
          <p style="margin-bottom:8px;">¿Necesitas ayuda? <a href="mailto:support@agenticflow.com" style="color:#2563eb;">Contactar soporte</a></p>
          <p style="font-size:12px;color:#888;">Si no solicitaste esta cuenta, ignora este correo.</p>
        </div>
      `;
    } else {
      html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 0; margin: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
            <tr>
              <td style="background:#2563eb;padding:32px 24px 16px 24px;text-align:center;">
                <img src='https:${process.env.APP_URL}/logo.png' alt='Agentic Flow Logo' style='height:48px;margin-bottom:12px;'>
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
    }
    try {
      await transporter.sendMail({
        from: '"Agentic Flow" <francismariogomez@gmail.com>',
        to: email,
        subject: lang === 'es' ? "¡Bienvenido a Agentic Flow!" : "Welcome to Agentic Flow!",
        html,
      });
    } catch (err: any) {
      status = 'failed';
      errorDetails = err?.message || JSON.stringify(err);
    }
    // Log onboarding event (email sent or failed)
    // You will need to pass userId to this function for full logging
    // await logOnboardingEvent(userId, 'welcome_email', errorDetails ? `error: ${errorDetails}` : 'sent');
    return errorDetails ? `${status}: ${errorDetails}` : status;
  }
  if (req.method === "GET") {
    const clients = await prisma.user.findMany({
      where: { role: "client" },
      include: { systems: { include: { system: true } } }
    });
    // Flatten systems for each client
    const clientsWithSystems = clients.map(client => ({
      ...client,
      systems: (client.systems || []).map((us: any) => us.system?.name)
    }));
    return res.status(200).json(clientsWithSystems);
  }

  if (req.method === "POST") {
      const { name, email, password, systems } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }
    try {
      // Generate secure tokens
      const setupToken = crypto.randomBytes(32).toString("hex");
      const verifyToken = crypto.randomBytes(32).toString("hex");
      // Create client with tokens and unverified status
      const client = await prisma.user.create({
        data: {
          name,
          email,
          password: "", // password will be set via setup-password endpoint
          role: "client",
          setupToken,
          verifyToken,
          verified: false,
        }
      });
      // Log onboarding event: client created
      await logOnboardingEvent(client.id, 'client_created');
      // Attach systems if provided
      if (Array.isArray(systems) && systems.length > 0) {
        const systemRecords = await Promise.all(
          systems.map(async (name: string) => {
            let sys = await prisma.system.findUnique({ where: { name } });
            if (!sys) {
              sys = await prisma.system.create({ data: { name } });
            }
            return sys;
          })
        );
        await prisma.user.update({
          where: { id: client.id },
          data: {
            systems: {
              create: systemRecords.map((sys) => ({ systemId: sys.id }))
            }
          }
        });
      }
      // Send welcome email with setup/verify links
      const emailStatus = await sendWelcomeEmail(email, name, setupToken, verifyToken);
      await prisma.user.update({ where: { id: client.id }, data: { emailStatus } });
      // Log onboarding event: welcome email sent/failed
      await logOnboardingEvent(client.id, 'welcome_email', emailStatus);
      // Return client with systems
      const clientWithSystems = await prisma.user.findUnique({
        where: { id: client.id },
        include: { systems: { include: { system: true } } }
      });
      return res.status(201).json(clientWithSystems);
    } catch (err) {
      return res.status(500).json({ error: "Could not create client", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
