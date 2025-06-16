import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ExternalLink,
  DollarSign,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { ClientPageMeta } from "@/page-config/meta.config";

interface AppointmentDetail {
  id: string;
  businessName: string;
  industry: string;
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  reason: string;
  location: string;
  meetingLink?: string;
  estimatedValue: number;
  notes: string;
  leadSource: string;
  timezone: string;
  createdAt: string;
}

const generateSingleAppointment = (id: string): AppointmentDetail | null => {
  const appointments: Record<string, AppointmentDetail> = {
    "apt-1001": {
      id: "apt-1001",
      businessName: "TechVenture Solutions",
      industry: "Technology",
      contactName: "Sarah Chen",
      contactTitle: "Chief Marketing Officer",
      contactPhone: "+1 (555) 234-5678",
      contactEmail: "s.chen@techventure.com",
      appointmentDate: "2025-06-20",
      appointmentTime: "14:30",
      duration: 60,
      reason: "AI Implementation Strategy Session",
      location: "Virtual Meeting",
      meetingLink: "https://meet.agentic-flow.com/room/1001",
      estimatedValue: 45000,
      notes:
        "Initial consultation to discuss AI implementation strategy and identify key automation opportunities for their sales process.",
      leadSource: "LinkedIn",
      timezone: "EST",
      createdAt: "2025-06-10T10:30:00Z",
    },
    "apt-1002": {
      id: "apt-1002",
      businessName: "GreenLeaf Marketing",
      industry: "Marketing Agency",
      contactName: "Michael Rodriguez",
      contactTitle: "VP of Sales",
      contactPhone: "+1 (555) 345-6789",
      contactEmail: "m.rodriguez@greenleaf.com",
      appointmentDate: "2025-06-22",
      appointmentTime: "10:00",
      duration: 30,
      reason: "Marketing Automation Consultation",
      location: "In-Person",
      meetingLink: undefined,
      estimatedValue: 25000,
      notes:
        "Follow-up meeting to review proposed marketing automation solution and discuss implementation timeline.",
      leadSource: "Website",
      timezone: "EST",
      createdAt: "2025-06-08T14:15:00Z",
    },
  };

  return appointments[id] || null;
};

const ClientAppointmentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null
  );

  useEffect(() => {
    if (id && typeof id === "string") {
      const appointmentData = generateSingleAppointment(id);
      setAppointment(appointmentData);
    }
  }, [id]);

  if (!appointment) {
    return (
      <DashboardLayout
        role="client"
        meta={ClientPageMeta.appointmentDetailPage}
      >
        <DashboardHeader
          title="Appointment Details"
          hasBackButton={true}
          onBackClick={() =>
            router.push("/client/leadgen-system/appointments")
          }
          role="client"
        />
        <div className="flex-1 px-8 py-2 flex items-center justify-center">
          <p className="text-muted-foreground">Appointment not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout role="client" meta={ClientPageMeta.appointmentDetailPage}>
      <DashboardHeader
        title="Appointment Details"
        hasBackButton={true}
        onBackClick={() => router.push("/client/leadgen-system/appointments")}
        role="client"
      />
      <div className="flex-1 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-900/20 via-blue-800/10 to-purple-900/20 rounded-2xl p-8 mb-8 border border-blue-900/30">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {appointment.businessName}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {appointment.industry}
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span className="text-lg font-medium">
                      {formatDate(appointment.appointmentDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <span className="text-lg font-medium">
                      {appointment.appointmentTime} ({appointment.duration}min)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  Estimated Value
                </p>
                <p className="text-2xl font-bold text-green-400">
                  ${appointment.estimatedValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contact & Meeting */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-card/30 rounded-xl p-6 border border-blue-900/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {appointment.contactName}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {appointment.contactTitle}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-blue-400">
                          {appointment.contactEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Business Details</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Industry:</span>{" "}
                        {appointment.industry}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Lead Source:
                        </span>{" "}
                        {appointment.leadSource}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Created:</span>{" "}
                        {new Date(appointment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Purpose */}
              <div className="bg-card/30 rounded-xl p-6 border border-blue-900/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Meeting Purpose</h2>
                </div>

                <h3 className="text-lg font-medium mb-3">
                  {appointment.reason}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {appointment.notes}
                </p>
              </div>
            </div>

            {/* Right Column - Meeting Details */}
            <div className="space-y-6">
              {/* Meeting Location */}
              <div className="bg-card/30 rounded-xl p-6 border border-blue-900/20">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold">Meeting Location</h3>
                </div>

                <p className="mb-4">{appointment.location}</p>

                {appointment.meetingLink && (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-blue-900/30 hover:bg-gradient-to-r hover:from-blue-800/30 hover:via-blue-700/20 hover:to-blue-500/25 hover:text-white"
                    onClick={() =>
                      window.open(appointment.meetingLink, "_blank")
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-card/30 rounded-xl p-6 border border-blue-900/20">
                <h3 className="font-semibold mb-4">Meeting Details</h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {appointment.duration} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timezone</span>
                    <span className="font-medium">{appointment.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{appointment.location}</span>
                  </div>
                </div>
              </div>

              {/* Value Estimate */}
              <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-6 border border-green-900/30">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <h3 className="font-semibold">Estimated Value</h3>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  ${appointment.estimatedValue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Potential deal value
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientAppointmentDetailPage;
