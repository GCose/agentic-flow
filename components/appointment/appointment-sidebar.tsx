"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Phone, Mail } from "lucide-react"
import type { Appointment } from "@/lib/appointments"

interface AppointmentSidebarProps {
  appointments: Appointment[]
}

export function AppointmentSidebar({ appointments }: AppointmentSidebarProps) {
  const upcomingAppointments = appointments.filter((apt) => apt.status === "scheduled").slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming appointments</p>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-border rounded-lg p-3 bg-background/50 hover:bg-background/80 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-foreground">{appointment.patientName}</h4>
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    {appointment.service}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {appointment.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {appointment.email}
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <strong className="text-foreground">Notes:</strong> <span className="text-muted-foreground">{appointment.notes}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
