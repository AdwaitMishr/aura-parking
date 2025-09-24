"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"
import { format } from "date-fns"

interface Booking {
  id: number
  startTime: Date
  endTime: Date
  userId: string
  parkingSpotId: number
  parkingSpot: {
    id: number
    spotNumber: string
    status: string
  }
}

interface UpcomingBookingsProps {
  bookings: Booking[]
}

export function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">My Upcoming Bookings</CardTitle>
        <CardDescription>Your reserved parking spots</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming bookings</p>
              <p className="text-sm text-muted-foreground mt-1">
                Book a parking spot to see it here
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-semibold">Spot {booking.parkingSpot.spotNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(booking.startTime, "MMM dd, yyyy")} • {format(booking.startTime, "HH:mm")} -{" "}
                          {format(booking.endTime, "HH:mm")}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {Math.round(
                          (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60 * 100),
                        ) / 10}
                        h
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">{booking.parkingSpot.status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
