"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminOverview } from "@/app/_components/admin/admin-overview"
import { AdminSpotManagement } from "@/app/_components/admin/admin-spot-management"
import { AdminBookingRecords } from "@/app/_components/admin/admin-booking-records"
import { AuthGuard } from "@/app/_components/auth/auth-guard"

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your parking facility</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spots">Spot Management</TabsTrigger>
            <TabsTrigger value="bookings">Booking Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="spots">
            <AdminSpotManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookingRecords />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
