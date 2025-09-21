"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParkingGrid } from "@/app/_components/shared/parking-grid"
import { mockParkingLot, mockUserBookings } from "@/lib/mock-data"
import type { ParkingSpot } from "@/lib/types"
import { CalendarIcon, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import { AuthGuard } from "@/app/_components/auth/auth-guard"

export default function UserDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ]

  const handleConfirmBooking = () => {
    if (selectedSpot && selectedDate && startTime && endTime) {
      // In a real app, this would make an API call
      alert(
        `Booking confirmed for spot ${selectedSpot.number} on ${format(selectedDate, "PPP")} from ${startTime} to ${endTime}`,
      )
    }
  }

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot)
  }

  return (
    <AuthGuard requiredRole="user">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">User Dashboard</h1>
          <p className="text-muted-foreground text-lg">Book your parking spot and manage your reservations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Controls */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Book Your Spot</CardTitle>
                <CardDescription>Select date, time, and parking spot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Start Time</label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">End Time</label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Booking Summary */}
                {selectedSpot && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Spot:</span>
                          <span className="text-sm font-bold">{selectedSpot.number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Date:</span>
                          <span className="text-sm font-bold">
                            {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Time:</span>
                          <span className="text-sm font-bold">
                            {startTime && endTime ? `${startTime} - ${endTime}` : "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Duration:</span>
                          <span className="font-bold">
                            {startTime && endTime
                              ? `${Number.parseInt(endTime.split(":")[0]) - Number.parseInt(startTime.split(":")[0])}h`
                              : "0h"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  className="w-full"
                  onClick={handleConfirmBooking}
                  disabled={!selectedSpot || !selectedDate || !startTime || !endTime}
                  size="lg"
                >
                  Confirm Booking
                </Button>
              </CardContent>
            </Card>

            {/* My Upcoming Bookings */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">My Upcoming Bookings</CardTitle>
                <CardDescription>Your reserved parking spots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserBookings.map((booking) => (
                    <Card key={booking.id} className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="font-semibold">Spot {booking.spotNumber}</span>
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
                            <div className="text-xs text-muted-foreground capitalize">{booking.status}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Parking Lot View */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-balance">{mockParkingLot.name}</h2>
              <p className="text-muted-foreground">Click on an available spot to select it</p>
            </div>
            <ParkingGrid
              spots={mockParkingLot.spots}
              selectedSpotId={selectedSpot?.id}
              onSpotSelect={handleSpotSelect}
              mode="user"
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
