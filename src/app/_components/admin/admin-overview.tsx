import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockParkingLot, mockBookings } from "@/lib/mock-data"
import { Car, Calendar, Clock, TrendingUp } from "lucide-react"

export function AdminOverview() {
  // Calculate KPIs
  const totalSpots = mockParkingLot.spots.length
  const occupiedSpots = mockParkingLot.spots.filter((spot) => spot.status === "occupied").length
  const occupancyRate = Math.round((occupiedSpots / totalSpots) * 100)

  const todayBookings = mockBookings.filter((booking) => {
    const today = new Date()
    const bookingDate = new Date(booking.startTime)
    return bookingDate.toDateString() === today.toDateString()
  }).length

  const averageDuration =
    mockBookings.reduce((total, booking) => {
      const duration = (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60)
      return total + duration
    }, 0) / mockBookings.length

  const kpis = [
    {
      title: "Current Occupancy",
      value: `${occupancyRate}%`,
      description: `${occupiedSpots} of ${totalSpots} spots occupied`,
      icon: Car,
      trend: "+2.5% from yesterday",
    },
    {
      title: "Total Bookings Today",
      value: todayBookings.toString(),
      description: "Active reservations",
      icon: Calendar,
      trend: "+12% from yesterday",
    },
    {
      title: "Average Duration",
      value: `${averageDuration.toFixed(1)}h`,
      description: "Per booking session",
      icon: Clock,
      trend: "+0.3h from yesterday",
    },
    {
      title: "Peak Usage Time",
      value: "2:00 PM",
      description: "Highest occupancy period",
      icon: TrendingUp,
      trend: "Consistent with trends",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-balance">Overview</h2>
        <p className="text-muted-foreground text-lg">Key performance indicators for your parking facility</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{kpi.value}</div>
                <p className="text-sm text-muted-foreground mb-2">{kpi.description}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{kpi.trend}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Spot Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-emerald-500 dark:bg-emerald-600 rounded-sm"></div>
                  <span className="font-medium">Available</span>
                </div>
                <span className="text-lg font-semibold">
                  {mockParkingLot.spots.filter((s) => s.status === "available").length} spots
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-muted rounded-sm"></div>
                  <span className="font-medium">Occupied</span>
                </div>
                <span className="text-lg font-semibold">
                  {mockParkingLot.spots.filter((s) => s.status === "occupied").length} spots
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-amber-500 dark:bg-amber-600 rounded-sm"></div>
                  <span className="font-medium">Maintenance</span>
                </div>
                <span className="text-lg font-semibold">
                  {mockParkingLot.spots.filter((s) => s.status === "maintenance").length} spots
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">New booking - Spot A2</span>
                <span className="text-sm text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Spot B3 checked out</span>
                <span className="text-sm text-muted-foreground">15 min ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Maintenance completed - C1</span>
                <span className="text-sm text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">New booking - Spot A4</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
