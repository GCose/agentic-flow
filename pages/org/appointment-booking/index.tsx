"use client"

import { useState, useEffect } from "react"
import { ChatInterface } from "@/components/appointment/chat-interface"
import { AppointmentSidebar } from "@/components/appointment/appointment-sidebar"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"
import { getAppointments, type Appointment } from "@/lib/appointments"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import RoleBasedRoute from "@/components/auth/RoleBasedRoute"
import { useRole } from "@/hooks/use-auth-store"

function AppointmentBookingContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const { role, isAdmin, isClient } = useRole()

  useEffect(() => {
    setAppointments(getAppointments())
  }, [])

  const handleAppointmentBooked = () => {
    // Refresh appointments when a new one is booked
    setAppointments(getAppointments())
  }

  const showAdminButton = isAdmin() || isClient()

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <header className="border-b border-border bg-card/90 backdrop-blur-sm p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Appointment Booking Assistant</h1>
          {showAdminButton && (
            <Link href="/client/appointment-booking/admin">
              <Button variant="outline" className="flex items-center gap-2 border-border hover:bg-accent hover:text-accent-foreground">
                <Settings className="h-4 w-4" />
                Admin Panel
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0 bg-background/50">
        <div className="flex-1 p-4 flex flex-col">
          <ChatInterface onAppointmentBooked={handleAppointmentBooked} />
        </div>
        <AppointmentSidebar appointments={appointments} />
      </div>
    </div>
  )
}

export default function AppointmentBookingPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'client', 'videographer', 'designer']}>
      <DashboardLayout
        meta={{
          title: "Appointment Booking",
          description: "Book and manage appointments with our AI assistant"
        }}
        allowedRoles={['admin', 'client', 'videographer', 'designer']}
      >
        <AppointmentBookingContent />
      </DashboardLayout>
    </RoleBasedRoute>
  )
}
