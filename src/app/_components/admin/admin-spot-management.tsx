"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParkingGrid } from "@/app/_components/shared/parking-grid"
import { mockParkingLot } from "@/lib/mock-data"
import type { ParkingSpot } from "@/lib/types"
import { Plus } from "lucide-react"

export function AdminSpotManagement() {
  const [spots, setSpots] = useState<ParkingSpot[]>(mockParkingLot.spots)
  const [editingSpot, setEditingSpot] = useState<ParkingSpot | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    number: "",
    status: "available" as ParkingSpot["status"],
    orientation: "north" as ParkingSpot["orientation"],
    x: 0,
    y: 0,
  })

  const handleSpotSelect = (spot: ParkingSpot) => {
    setEditingSpot(spot)
    setFormData({
      number: spot.number,
      status: spot.status,
      orientation: spot.orientation,
      x: spot.x,
      y: spot.y,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveSpot = () => {
    // Validate form data
    if (!formData.number.trim()) {
      alert("Please enter a spot number")
      return
    }

    // Check for duplicate spot numbers (excluding current spot when editing)
    const isDuplicate = spots.some(
      (spot) => spot.number === formData.number && (!editingSpot || spot.id !== editingSpot.id),
    )

    if (isDuplicate) {
      alert("A spot with this number already exists")
      return
    }

    // Check for duplicate positions (excluding current spot when editing)
    const isPositionTaken = spots.some(
      (spot) => spot.x === formData.x && spot.y === formData.y && (!editingSpot || spot.id !== editingSpot.id),
    )

    if (isPositionTaken) {
      alert("This position is already occupied by another spot")
      return
    }

    if (editingSpot) {
      // Update existing spot
      setSpots(spots.map((spot) => (spot.id === editingSpot.id ? { ...spot, ...formData } : spot)))
    } else {
      // Add new spot
      const newSpot: ParkingSpot = {
        id: `spot-${Date.now()}`,
        ...formData,
      }
      setSpots([...spots, newSpot])
    }

    setIsEditDialogOpen(false)
    setIsAddDialogOpen(false)
    setEditingSpot(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      number: "",
      status: "available",
      orientation: "north",
      x: 0,
      y: 0,
    })
  }

  const handleAddNewSpot = () => {
    resetForm()
    setEditingSpot(null)
    setIsAddDialogOpen(true)
  }

  const SpotEditDialog = ({
    isOpen,
    onOpenChange,
    title,
  }: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
  }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {editingSpot ? "Edit the parking spot details below." : "Add a new parking spot to the lot."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right font-medium">
              Spot Number
            </Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="col-span-3"
              placeholder="e.g., A1, B2, C3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right font-medium">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: ParkingSpot["status"]) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="orientation" className="text-right font-medium">
              Orientation
            </Label>
            <Select
              value={formData.orientation}
              onValueChange={(value: ParkingSpot["orientation"]) => setFormData({ ...formData, orientation: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="x" className="text-right font-medium">
              X Position
            </Label>
            <Input
              id="x"
              type="number"
              value={formData.x}
              onChange={(e) => setFormData({ ...formData, x: Number.parseInt(e.target.value) || 0 })}
              className="col-span-3"
              min="0"
              max="10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="y" className="text-right font-medium">
              Y Position
            </Label>
            <Input
              id="y"
              type="number"
              value={formData.y}
              onChange={(e) => setFormData({ ...formData, y: Number.parseInt(e.target.value) || 0 })}
              className="col-span-3"
              min="0"
              max="10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSpot}>{editingSpot ? "Save Changes" : "Add Spot"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-balance">Spot Management</h2>
          <p className="text-muted-foreground text-lg">
            Click on any spot to edit its details or add new spots to the parking lot
          </p>
        </div>
        <Button onClick={handleAddNewSpot} size="lg" className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New Spot
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ParkingGrid spots={spots} onSpotSelect={handleSpotSelect} mode="admin" />
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold mb-4 text-lg">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Spots:</span>
                <span className="font-bold text-xl">{spots.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Available:</span>
                <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
                  {spots.filter((s) => s.status === "available").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Occupied:</span>
                <span className="font-bold text-xl text-muted-foreground">
                  {spots.filter((s) => s.status === "occupied").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Maintenance:</span>
                <span className="font-bold text-xl text-amber-600 dark:text-amber-400">
                  {spots.filter((s) => s.status === "maintenance").length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold mb-4 text-lg">Instructions</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Click any spot to edit its details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Use "Add New Spot" to create spots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Set X,Y coordinates for positioning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Choose orientation for car direction</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Spot Dialog */}
      <SpotEditDialog isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Edit Spot" />

      {/* Add Spot Dialog */}
      <SpotEditDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} title="Add New Spot" />
    </div>
  )
}
