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
import { PrismaClient, User } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";
// ...existing code...

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
          <img src='https://yourdomain.com/images/icon.png' alt='Agentic Flow Logo' style='height:48px;margin-bottom:16px;'>
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
            <li><a href="https://yourdomain.com/docs" style="color:#2563eb;">Documentación</a></li>
            <li><a href="https://yourdomain.com/tutorials" style="color:#2563eb;">Tutoriales en video</a></li>
            <li><a href="https://yourdomain.com/support" style="color:#2563eb;">Centro de soporte</a></li>
          </ul>
          <p style="margin-bottom:8px;">¿Necesitas ayuda? <a href="mailto:support@agenticflow.com" style="color:#2563eb;">Contactar soporte</a></p>
          <p style="font-size:12px;color:#888;">Si no solicitaste esta cuenta, ignora este correo.</p>
        </div>
      `;
    } else {
      html = `
        <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:32px;border-radius:12px;max-width:600px;margin:auto;">
          <img src='https://yourdomain.com/logo.png' alt='Agentic Flow Logo' style='height:48px;margin-bottom:16px;'>
          <h1 style="color:#2563eb;">Welcome to Agentic Flow, ${name}!</h1>
          <p style="font-size:16px;">We're excited to have you onboard. Here’s how to get started:</p>
          <ol style="margin:16px 0 24px 24px;font-size:15px;">
            <li>Set your password: <a href="${process.env.APP_URL}/setup-password?token=${setupToken}" style="color:#2563eb;font-weight:bold;">Set Password</a></li>
            <li>Verify your email: <a href="${process.env.APP_URL}/verify-email?token=${verifyToken}" style="color:#22c55e;font-weight:bold;">Verify Email</a></li>
            <li>Login: <a href="${process.env.APP_URL}/login" style="color:#2563eb;font-weight:bold;">Agentic Flow Login</a></li>
          </ol>
          <hr style="margin:24px 0;">
          <h2 style="color:#2563eb;font-size:18px;margin-bottom:8px;">Get Started Resources</h2>
          <ul style="margin-bottom:16px;">
            <li><a href="https://yourdomain.com/docs" style="color:#2563eb;">Documentation</a></li>
            <li><a href="https://yourdomain.com/tutorials" style="color:#2563eb;">Video Tutorials</a></li>
            <li><a href="https://yourdomain.com/support" style="color:#2563eb;">Support Center</a></li>
          </ul>
          <p style="margin-bottom:8px;">Need help? <a href="mailto:support@agenticflow.com" style="color:#2563eb;">Contact Support</a></p>
          <p style="font-size:12px;color:#888;">If you did not request this account, please ignore this email.</p>
        </div>
      `;
    }
    try {
      await transporter.sendMail({
        from: '"Agentic Flow" <no-reply@agenticflow.com>',
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
    const { name, email, password, description, systems } = req.body;
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
          password, // still hashed, but not sent via email
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
