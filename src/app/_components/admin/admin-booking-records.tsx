"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { mockBookings } from "@/lib/mock-data"
import type { Booking } from "@/lib/types"
import { Search, MoreHorizontal, X } from "lucide-react"
import { format } from "date-fns"

export function AdminBookingRecords() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.spotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCancelBooking = (bookingId: string) => {
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))
  }

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Active
          </Badge>
        )
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-balance">Booking Records</h2>
        <p className="text-muted-foreground text-lg">View and manage all parking reservations</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, spot number, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>

      {/* Bookings Table */}
      <div className="border rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Spot Number</TableHead>
              <TableHead className="font-semibold">User Name</TableHead>
              <TableHead className="font-semibold">User Email</TableHead>
              <TableHead className="font-semibold">Start Time</TableHead>
              <TableHead className="font-semibold">End Time</TableHead>
              <TableHead className="font-semibold">Duration</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchTerm ? "No bookings found matching your search." : "No bookings found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => {
                const duration =
                  Math.round(
                    (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) /
                      (1000 * 60 * 60 * 100),
                  ) / 10

                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.spotNumber}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.userEmail}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{format(booking.startTime, "MMM dd, yyyy")}</div>
                        <div className="text-sm text-muted-foreground">{format(booking.startTime, "HH:mm")}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{format(booking.endTime, "MMM dd, yyyy")}</div>
                        <div className="text-sm text-muted-foreground">{format(booking.endTime, "HH:mm")}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{duration}h</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={booking.status === "cancelled" || booking.status === "completed"}
                            className="text-destructive focus:text-destructive"
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {bookings.filter((b) => b.status === "active").length}
          </div>
          <div className="text-sm text-muted-foreground font-medium">Active Bookings</div>
        </div>
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {bookings.filter((b) => b.status === "completed").length}
          </div>
          <div className="text-sm text-muted-foreground font-medium">Completed</div>
        </div>
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {bookings.filter((b) => b.status === "cancelled").length}
          </div>
          <div className="text-sm text-muted-foreground font-medium">Cancelled</div>
        </div>
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="text-3xl font-bold">
            {Math.round(
              (bookings.reduce((total, booking) => {
                const duration =
                  (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60)
                return total + duration
              }, 0) /
                bookings.length) *
                10,
            ) / 10}
            h
          </div>
          <div className="text-sm text-muted-foreground font-medium">Avg Duration</div>
        </div>
      </div>
    </div>
  )
}
