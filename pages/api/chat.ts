import { NextApiRequest, NextApiResponse } from 'next';
import { getAppointments, addAppointment, getAvailableSlots, getAssistantSettings } from "@/lib/appointments";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    const assistantSettings = getAssistantSettings();

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Fallback response when OpenAI is not configured
      const mockResponse = {
        content: "Hello! I'm your appointment booking assistant. I can help you schedule appointments, check availability, and manage your bookings. However, the AI features are currently not configured. Please contact your administrator to set up the OpenAI API key for full functionality.\n\nFor now, you can still use the admin panel to manually manage appointments."
      };

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      res.write(`data: ${JSON.stringify(mockResponse)}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    // Original OpenAI streaming implementation
    const { streamText } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");

    const appointments = getAppointments();
    const upcomingAppointments = appointments.filter((apt) => apt.status === "scheduled");

    const systemPrompt = `${assistantSettings.systemPrompt}

Current upcoming appointments: ${JSON.stringify(upcomingAppointments, null, 2)}`;

    const result = await streamText({
      model: openai(assistantSettings.model),
      system: systemPrompt,
      messages,
      temperature: assistantSettings.temperature,
      tools: {
        checkAvailability: {
          description: "Check available appointment slots for a specific date",
          parameters: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description: "Date in YYYY-MM-DD format",
              },
            },
            required: ["date"],
          },
          execute: async ({ date }) => {
            const slots = getAvailableSlots(date);
            return { availableSlots: slots };
          },
        },
        bookAppointment: {
          description: "Book a new appointment",
          parameters: {
            type: "object",
            properties: {
              patientName: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              date: { type: "string" },
              time: { type: "string" },
              service: { type: "string" },
              notes: { type: "string" },
            },
            required: ["patientName", "email", "phone", "date", "time", "service"],
          },
          execute: async (params) => {
            const appointment = addAppointment({
              ...params,
              status: "scheduled",
            });
            return { success: true, appointment };
          },
        },
      },
    });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Convert the stream to the format expected by the client
    const textStream = result.toTextStreamResponse();
    const reader = textStream.body?.getReader();
    
    if (!reader) {
      return res.status(500).json({ error: 'Failed to create stream' });
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      res.write(value);
    }
    
    res.end();
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
