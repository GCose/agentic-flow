import { useState } from "react";
import { Search, RefreshCw, Calendar, Clock, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";

interface Appointment {
  id: string;
  businessName: string;
  industry: string;
  contactName: string;
  contactTitle: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  reason: string;
  location: string;
  estimatedValue: number;
}

const generateAppointments = (): Appointment[] => {
  return [
    {
      id: "apt-1001",
      businessName: "TechVenture Solutions",
      industry: "Technology",
      contactName: "Sarah Chen",
      contactTitle: "Chief Marketing Officer",
      appointmentDate: "2025-06-20",
      appointmentTime: "14:30",
      duration: 60,
      reason: "AI Implementation Strategy Session",
      location: "Virtual Meeting",
      estimatedValue: 45000,
    },
    {
      id: "apt-1002",
      businessName: "GreenLeaf Marketing",
      industry: "Marketing Agency",
      contactName: "Michael Rodriguez",
      contactTitle: "VP of Sales",
      appointmentDate: "2025-06-22",
      appointmentTime: "10:00",
      duration: 30,
      reason: "Marketing Automation Consultation",
      location: "In-Person",
      estimatedValue: 25000,
    },
    {
      id: "apt-1003",
      businessName: "Apex Manufacturing",
      industry: "Manufacturing",
      contactName: "Emily Johnson",
      contactTitle: "Head of Operations",
      appointmentDate: "2025-06-25",
      appointmentTime: "09:00",
      duration: 45,
      reason: "Sales Process Optimization Review",
      location: "Virtual Meeting",
      estimatedValue: 35000,
    },
    {
      id: "apt-1004",
      businessName: "Digital Dynamics Inc",
      industry: "Software Development",
      contactName: "David Park",
      contactTitle: "CEO",
      appointmentDate: "2025-06-18",
      appointmentTime: "15:00",
      duration: 60,
      reason: "Lead Generation System Demo",
      location: "Virtual Meeting",
      estimatedValue: 50000,
    },
    {
      id: "apt-1005",
      businessName: "Healthcare Innovations",
      industry: "Healthcare",
      contactName: "Lisa Thompson",
      contactTitle: "Marketing Director",
      appointmentDate: "2025-06-28",
      appointmentTime: "11:30",
      duration: 30,
      reason: "Content Strategy Planning Meeting",
      location: "In-Person",
      estimatedValue: 20000,
    },
  ];
};

const Appointments = ({ role }: { role: "admin" | "client" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>(
    generateAppointments()
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAppointments(generateAppointments());
    setIsRefreshing(false);
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.businessName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (appointmentId: string): void => {
    router.push(`/${role}/leadgen-system/appointments/${appointmentId}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="border-none bg-transparent">
      <CardHeader className="flex gap-4 items-center justify-between">
        <CardTitle className="font-medium text-md">
          View and manage your booked appointments with potential clients.
        </CardTitle>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              placeholder="Search appointments..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-transparent border-blue-900/30 min-w-[300px]"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-transparent border-blue-900/30 hover:bg-gradient-to-r hover:from-blue-800/30 hover:via-blue-700/20 hover:to-blue-500/25 hover:text-white hover:border-blue-600/50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="bg-gradient-to-br from-blue-900/10 via-blue-800/5 to-blue-500/10 border-blue-900/30 hover:from-blue-900/20 hover:via-blue-800/10 hover:to-blue-500/20 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer group"
              onClick={() => handleCardClick(appointment.id)}
            >
              <CardContent className="px-6">
                <div className="flex justify-center items-center mb-8">
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-500" />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">
                        {appointment.businessName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.industry}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">
                      Appointment Date:{" "}
                      {formatDate(appointment.appointmentDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>Appointment Time: {appointment.appointmentTime}</span>
                  </div>

                  <div className="pt-2 border-t border-blue-900/20">
                    <p className="text-sm text-muted-foreground">
                      with {appointment.contactName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No appointments found matching your search.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Appointments;
