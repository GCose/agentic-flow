export interface Appointment {
  id: string
  patientName: string
  email: string
  phone: string
  date: string
  time: string
  service: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  createdAt: string
}

// In-memory storage (in a real app, this would be a database)
const appointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    date: "2024-01-15",
    time: "10:00",
    service: "General Consultation",
    status: "scheduled",
    notes: "First time patient",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    date: "2024-01-16",
    time: "14:30",
    service: "Follow-up",
    status: "scheduled",
    createdAt: "2024-01-11T11:30:00Z",
  },
]

export function getAppointments(): Appointment[] {
  return appointments.sort(
    (a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime(),
  )
}

export function addAppointment(appointment: Omit<Appointment, "id" | "createdAt">): Appointment {
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  appointments.push(newAppointment)
  return newAppointment
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const index = appointments.findIndex((apt) => apt.id === id)
  if (index === -1) return null

  appointments[index] = { ...appointments[index], ...updates }
  return appointments[index]
}

export function deleteAppointment(id: string): boolean {
  const index = appointments.findIndex((apt) => apt.id === id)
  if (index === -1) return false

  appointments.splice(index, 1)
  return true
}

export function getAvailableSlots(date: string): string[] {
  const bookedSlots = appointments
    .filter((apt) => apt.date === date && apt.status === "scheduled")
    .map((apt) => apt.time)

  const allSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  return allSlots.filter((slot) => !bookedSlots.includes(slot))
}

// New interfaces and functions

export interface AssistantSettings {
  id: string
  systemPrompt: string
  name: string
  greeting: string
  model: string
  temperature: number
  maxTokens: number
  updatedAt: string
}

// Default assistant settings
const defaultAssistantSettings: AssistantSettings = {
  id: "default",
  systemPrompt: `You are a helpful appointment booking assistant for a medical practice. You can help users:

1. Book new appointments
2. Check appointment availability
3. Provide information about services
4. Answer general questions

Available services:
- General Consultation
- Follow-up Appointment
- Specialist Consultation
- Health Checkup
- Vaccination

When booking appointments:
- Ask for: patient name, email, phone, preferred date/time, and service type
- Check availability using the getAvailableSlots function
- Confirm all details before booking
- Be friendly and professional

Available time slots are typically:
Morning: 9:00 AM - 12:00 PM (30-minute intervals)
Afternoon: 2:00 PM - 5:00 PM (30-minute intervals)

If a user wants to book an appointment, gather all necessary information first, then confirm the booking.`,
  name: "Appointment Assistant",
  greeting:
    "Hello! I'm your appointment booking assistant. I can help you schedule appointments, check availability, or answer questions about our services. How can I help you today?",
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 1000,
  updatedAt: new Date().toISOString(),
}

// In-memory storage for assistant settings
let assistantSettings: AssistantSettings = { ...defaultAssistantSettings }

export function getAssistantSettings(): AssistantSettings {
  return assistantSettings
}

export function updateAssistantSettings(updates: Partial<AssistantSettings>): AssistantSettings {
  assistantSettings = {
    ...assistantSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return assistantSettings
}

export function resetAssistantSettings(): AssistantSettings {
  assistantSettings = { ...defaultAssistantSettings, updatedAt: new Date().toISOString() }
  return assistantSettings
}

export const promptTemplates = [
  {
    name: "Professional Medical",
    prompt: `You are a professional medical appointment assistant. You maintain a formal, clinical tone while being helpful and efficient.

Your responsibilities:
1. Schedule medical appointments with precision
2. Verify patient information thoroughly
3. Provide accurate medical office information
4. Handle appointment changes professionally

Always confirm patient details twice and maintain patient confidentiality.`,
  },
  {
    name: "Friendly & Casual",
    prompt: `You are a friendly, approachable appointment assistant who makes patients feel comfortable and welcome.

Your approach:
1. Use warm, conversational language
2. Show empathy and understanding
3. Make the booking process feel easy and stress-free
4. Add personal touches while remaining professional

Remember to be patient with elderly patients and those who may need extra help.`,
  },
  {
    name: "Multilingual Support",
    prompt: `You are a multilingual appointment assistant capable of helping patients in multiple languages.

Key features:
1. Detect the patient's preferred language
2. Offer to continue in their native language
3. Provide clear translations of medical terms
4. Ensure cultural sensitivity in all interactions

Always confirm understanding when language barriers might exist.`,
  },
]
