"use client"

import { useState } from "react"
import { format } from "date-fns"
import { AuthGuard } from "@/app/_components/auth/auth-guard"
import { Header } from "@/app/_components/landing/header"
import { BookingForm } from "@/app/_components/dashboard/booking-form"
import { UpcomingBookings } from "@/app/_components/dashboard/upcoming-bookings"
import { ParkingLotView } from "@/app/_components/dashboard/parking-lot-view"
import { api } from "@/trpc/react"

export default function UserDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null)

  // Fetch user bookings
  const { data: userBookings = [], refetch: refetchBookings } = api.booking.getUserBookings.useQuery({
    includeHistory: false
  })

  // Fetch dashboard data (assuming parking lot ID 1 for now)
  const { data: dashboardData } = api.dashboard.getUserDashboardData.useQuery({
    parkingLotId: 1
  })

  // Create booking mutation
  const createBookingMutation = api.booking.create.useMutation({
    onSuccess: () => {
      refetchBookings()
      setSelectedSpot(null)
      setStartTime("")
      setEndTime("")
      alert("Booking confirmed successfully!")
    },
    onError: (error) => {
      alert(`Booking failed: ${error.message}`)
    }
  })

  const handleConfirmBooking = () => {
    if (selectedSpot && selectedDate && startTime && endTime) {
      // Convert time strings to full dates
      const startDateTime = new Date(selectedDate)
      const [startHour, startMinute] = startTime.split(':').map(Number)
      if (startHour !== undefined && startMinute !== undefined) {
        startDateTime.setHours(startHour, startMinute, 0, 0)
      }

      const endDateTime = new Date(selectedDate)
      const [endHour, endMinute] = endTime.split(':').map(Number)
      if (endHour !== undefined && endMinute !== undefined) {
        endDateTime.setHours(endHour, endMinute, 0, 0)
      }

      createBookingMutation.mutate({
        parkingSpotId: selectedSpot.id,
        startTime: startDateTime,
        endTime: endDateTime,
      })
    }
  }

  const handleSpotSelect = (spot: any) => {
    setSelectedSpot(spot)
  }

  return (
    <AuthGuard requiredRole="USER">
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-balance mb-2">User Dashboard</h1>
            <p className="text-muted-foreground text-lg">Book your parking spot and manage your reservations</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Booking Controls */}
            <div className="space-y-6">
              <BookingForm
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                selectedSpot={selectedSpot}
                onConfirmBooking={handleConfirmBooking}
              />

              <UpcomingBookings bookings={userBookings} />
            </div>

            {/* Right Column - Parking Lot View */}
            <ParkingLotView
              spots={dashboardData?.parkingLot?.spots || []}
              selectedSpotId={selectedSpot?.id}
              onSpotSelect={handleSpotSelect}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
