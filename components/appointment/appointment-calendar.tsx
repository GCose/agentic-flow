"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import type { Appointment } from "@/lib/appointments"

interface AppointmentCalendarProps {
  appointments: Appointment[]
  onDateSelect?: (date: string) => void
}

export function AppointmentCalendar({ appointments, onDateSelect }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter((apt) => apt.date === date)
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const days = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24"></div>)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayAppointments = getAppointmentsForDate(dateString)
    const isToday = dateString === new Date().toISOString().split("T")[0]

    days.push(
      <div
        key={day}
        className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
          isToday ? "bg-blue-50 border-blue-200" : ""
        }`}
        onClick={() => onDateSelect?.(dateString)}
      >
        <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : ""}`}>{day}</div>
        <div className="space-y-1">
          {dayAppointments.slice(0, 2).map((apt) => (
            <div
              key={apt.id}
              className={`text-xs p-1 rounded truncate ${
                apt.status === "scheduled"
                  ? "bg-blue-100 text-blue-800"
                  : apt.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }`}
              title={`${apt.time} - ${apt.patientName}`}
            >
              {apt.time} {apt.patientName}
            </div>
          ))}
          {dayAppointments.length > 2 && (
            <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
          )}
        </div>
      </div>,
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Calendar
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[200px] text-center">{monthYear}</span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center font-medium text-gray-600 border-b">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0 border">{days}</div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">Completed</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
