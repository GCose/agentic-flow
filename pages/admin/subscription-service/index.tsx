import Link from "next/link"
import { Plus, Users, DollarSign, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import RoleBasedRoute from "@/components/auth/RoleBasedRoute"

// Updated mock data - replace with actual data fetching
const services = [
  {
    id: 1,
    name: "Email Marketing Platform",
    totalPlans: 3,
    subscribers: 156,
    revenue: 4680.44,
    status: "active",
    description: "Email marketing automation and campaigns",
  },
  {
    id: 2,
    name: "CRM System",
    totalPlans: 3,
    subscribers: 89,
    revenue: 4455.11,
    status: "active",
    description: "Customer relationship management solution",
  },
  {
    id: 3,
    name: "Analytics Dashboard",
    totalPlans: 3,
    subscribers: 67,
    revenue: 2679.33,
    status: "active",
    description: "Business analytics and reporting",
  },
  {
    id: 4,
    name: "Project Management",
    totalPlans: 3,
    subscribers: 134,
    revenue: 3347.66,
    status: "draft",
    description: "Team workflow and productivity tools",
  },
]

function SubscriptionServiceContent() {
  const totalRevenue = services.reduce((sum, service) => sum + service.revenue, 0)
  const totalSubscribers = services.reduce((sum, service) => sum + service.subscribers, 0)

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="border-b bg-white flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Link href="/admin/services/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Service
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscribers}</div>
              <p className="text-xs text-muted-foreground">Active subscriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.filter((s) => s.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">Published services</p>
            </CardContent>
          </Card>
        </div>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>Manage your subscription services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{service.name}</h3>
                      <Badge variant={service.status === "active" ? "default" : "secondary"}>{service.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{service.totalPlans} plans</span>
                      <span>{service.subscribers} subscribers</span>
                      <span>${service.revenue.toFixed(2)} revenue</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/services/${service.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <RoleBasedRoute allowedRoles={['Administrator']}>
      <DashboardLayout
        meta={{
          title: "Subscription Services",
          description: "Manage subscription services and plans"
        }}
        allowedRoles={['Administrator']}
      >
        <SubscriptionServiceContent />
      </DashboardLayout>
    </RoleBasedRoute>
  )
}
