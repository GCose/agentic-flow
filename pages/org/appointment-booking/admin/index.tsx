"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AppointmentCalendar } from "@/components/appointment/appointment-calendar"
import { ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  type Appointment,
} from "@/lib/appointments"
import { AssistantManagement } from "@/components/appointment/assistant-management"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import RoleBasedRoute from "@/components/auth/RoleBasedRoute"

function AdminPageContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    setAppointments(getAppointments())
  }, [])

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm)
    const matchesDate = !selectedDate || apt.date === selectedDate
    return matchesSearch && matchesDate
  })

  const handleAddAppointment = (formData: FormData) => {
    const appointmentData = {
      patientName: formData.get("patientName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      service: formData.get("service") as string,
      status: formData.get("status") as "scheduled" | "completed" | "cancelled",
      notes: (formData.get("notes") as string) || undefined,
    }

    addAppointment(appointmentData)
    setAppointments(getAppointments())
    setShowAddForm(false)
  }

  const handleUpdateAppointment = (formData: FormData) => {
    if (!editingAppointment) return

    const updates = {
      patientName: formData.get("patientName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      service: formData.get("service") as string,
      status: formData.get("status") as "scheduled" | "completed" | "cancelled",
      notes: (formData.get("notes") as string) || undefined,
    }

    updateAppointment(editingAppointment.id, updates)
    setAppointments(getAppointments())
    setEditingAppointment(null)
  }

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment(id)
      setAppointments(getAppointments())
    }
  }

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

  const AppointmentForm = ({
    appointment,
    onSubmit,
    onCancel,
  }: {
    appointment?: Appointment
    onSubmit: (formData: FormData) => void
    onCancel: () => void
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{appointment ? "Edit Appointment" : "Add New Appointment"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input id="patientName" name="patientName" defaultValue={appointment?.patientName} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={appointment?.email} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={appointment?.phone} required />
            </div>
            <div>
              <Label htmlFor="service">Service</Label>
              <Select name="service" defaultValue={appointment?.service}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Consultation">General Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Specialist Consultation">Specialist Consultation</SelectItem>
                  <SelectItem value="Health Checkup">Health Checkup</SelectItem>
                  <SelectItem value="Vaccination">Vaccination</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={appointment?.date} required />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" defaultValue={appointment?.time} required />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={appointment?.status || "scheduled"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={appointment?.notes} placeholder="Additional notes..." />
          </div>

          <div className="flex gap-2">
            <Button type="submit">{appointment ? "Update" : "Add"} Appointment</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <header className="bg-card/90 backdrop-blur-sm border-b border-border p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/client/appointment-booking">
              <Button variant="outline" size="sm" className="border-border hover:bg-accent hover:text-accent-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-500 hover:from-blue-800 hover:via-blue-700 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20">
            <Plus className="h-4 w-4" />
            Add Appointment
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {(showAddForm || editingAppointment) && (
          <AppointmentForm
            appointment={editingAppointment || undefined}
            onSubmit={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
            onCancel={() => {
              setShowAddForm(false)
              setEditingAppointment(null)
            }}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <AppointmentCalendar appointments={appointments} onDateSelect={setSelectedDate} />
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Appointment Management</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
                {selectedDate && (
                  <Button variant="outline" onClick={() => setSelectedDate("")} size="sm" className="border-border hover:bg-accent hover:text-accent-foreground">
                    Clear Date Filter
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No appointments found</p>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">{appointment.patientName}</h4>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          <Button size="sm" variant="outline" onClick={() => setEditingAppointment(appointment)} className="border-border hover:bg-accent hover:text-accent-foreground">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteAppointment(appointment.id)} className="border-border hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <strong className="text-foreground">Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong className="text-foreground">Time:</strong> {appointment.time}
                        </p>
                        <p>
                          <strong className="text-foreground">Service:</strong> {appointment.service}
                        </p>
                        <p>
                          <strong className="text-foreground">Email:</strong> {appointment.email}
                        </p>
                        <p>
                          <strong className="text-foreground">Phone:</strong> {appointment.phone}
                        </p>
                        {appointment.notes && (
                          <p>
                            <strong className="text-foreground">Notes:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <AssistantManagement />
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'client']}>
      <DashboardLayout
        meta={{
          title: "Appointment Admin",
          description: "Manage appointments and AI assistant settings"
        }}
        allowedRoles={['admin', 'client']}
      >
        <AdminPageContent />
      </DashboardLayout>
    </RoleBasedRoute>
  )
}
