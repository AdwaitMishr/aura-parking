"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface BookingFormProps {
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  startTime: string
  setStartTime: (time: string) => void
  endTime: string
  setEndTime: (time: string) => void
  selectedSpot: any | null
  onConfirmBooking: () => void
}

export function BookingForm({
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  selectedSpot,
  onConfirmBooking
}: BookingFormProps) {
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  ]

  return (
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
                      ? `${Number.parseInt(endTime.split(":")[0]!) - Number.parseInt(startTime.split(":")[0]!)}h`
                      : "0h"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          className="w-full"
          onClick={onConfirmBooking}
          disabled={!selectedSpot || !selectedDate || !startTime || !endTime}
          size="lg"
        >
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  )
}
