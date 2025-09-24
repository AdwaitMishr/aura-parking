"use client"

import { useState, useCallback, useMemo, memo } from "react"
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
import { api } from "@/trpc/react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function AdminSpotManagement() {
  const [editingSpot, setEditingSpot] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Form state - using separate state to prevent re-renders on every keystroke
  const [formData, setFormData] = useState({
    spotNumber: "",
    status: "AVAILABLE" as "AVAILABLE" | "OCCUPIED" | "RESERVED" | "UNDER_MAINTENANCE",
    orientation: "N" as string,
    gridRow: 0,
    gridCol: 0,
  })

  // Fetch parking lot data (assuming parking lot ID 1 for now)
  const { data: parkingLotData, refetch } = api.admin.getParkingLotForManagement.useQuery({
    parkingLotId: 1
  })

  // Mutations
  const createSpotMutation = api.admin.createParkingSpot.useMutation({
    onSuccess: () => {
      toast.success("Parking spot created successfully!")
      refetch()
      setIsAddDialogOpen(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(`Failed to create spot: ${error.message}`)
    }
  })

  const updateSpotMutation = api.admin.updateParkingSpot.useMutation({
    onSuccess: () => {
      toast.success("Parking spot updated successfully!")
      refetch()
      setIsEditDialogOpen(false)
      setEditingSpot(null)
      resetForm()
    },
    onError: (error) => {
      toast.error(`Failed to update spot: ${error.message}`)
    }
  })

  const deleteSpotMutation = api.admin.deleteParkingSpot.useMutation({
    onSuccess: () => {
      toast.success("Parking spot deleted successfully!")
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to delete spot: ${error.message}`)
    }
  })

  const spots = parkingLotData?.spots || []

  const handleSpotSelect = useCallback((spot: any) => {
    setEditingSpot(spot)
    setFormData({
      spotNumber: spot.spotNumber,
      status: spot.status,
      orientation: spot.orientation,
      gridRow: spot.gridRow,
      gridCol: spot.gridCol,
    })
    setIsEditDialogOpen(true)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!formData.spotNumber.trim()) {
      toast.error("Please enter a spot number")
      return
    }

    // Check for duplicate spot numbers (excluding current spot when editing)
    const isDuplicate = spots.some(
      (spot) => spot.spotNumber === formData.spotNumber && (!editingSpot || spot.id !== editingSpot.id),
    )

    if (isDuplicate) {
      toast.error("A spot with this number already exists")
      return
    }

    // Check for duplicate positions (excluding current spot when editing)
    const isPositionTaken = spots.some(
      (spot) => spot.gridRow === formData.gridRow && spot.gridCol === formData.gridCol && (!editingSpot || spot.id !== editingSpot.id),
    )

    if (isPositionTaken) {
      toast.error("This position is already occupied by another spot")
      return
    }

    if (editingSpot) {
      // Update existing spot
      updateSpotMutation.mutate({
        spotId: editingSpot.id,
        spotNumber: formData.spotNumber,
        gridRow: formData.gridRow,
        gridCol: formData.gridCol,
        orientation: formData.orientation,
        status: formData.status,
      })
    } else {
      // Create new spot
      createSpotMutation.mutate({
        parkingLotId: 1, // Assuming parking lot ID 1
        spotNumber: formData.spotNumber,
        gridRow: formData.gridRow,
        gridCol: formData.gridCol,
        orientation: formData.orientation,
        status: formData.status,
      })
    }
  }, [formData, spots, editingSpot, updateSpotMutation, createSpotMutation])

  const handleDeleteSpot = useCallback((spotId: number) => {
    if (confirm("Are you sure you want to delete this parking spot?")) {
      deleteSpotMutation.mutate({ spotId })
    }
  }, [deleteSpotMutation])

  const resetForm = useCallback(() => {
    setFormData({
      spotNumber: "",
      status: "AVAILABLE",
      orientation: "N",
      gridRow: 0,
      gridCol: 0,
    })
  }, [])

  const handleAddNewSpot = useCallback(() => {
    resetForm()
    setEditingSpot(null)
    setIsAddDialogOpen(true)
  }, [resetForm])

  // Optimized form field handlers to prevent unnecessary re-renders
  const updateFormField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])


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
                  {spots.filter((s) => s.status === "AVAILABLE").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Occupied:</span>
                <span className="font-bold text-xl text-muted-foreground">
                  {spots.filter((s) => s.status === "OCCUPIED").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reserved:</span>
                <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                  {spots.filter((s) => s.status === "RESERVED").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Maintenance:</span>
                <span className="font-bold text-xl text-amber-600 dark:text-amber-400">
                  {spots.filter((s) => s.status === "UNDER_MAINTENANCE").length}
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
      <SpotEditDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        title="Edit Spot"
        formData={formData}
        editingSpot={editingSpot}
        updateFormField={updateFormField}
        handleSubmit={handleSubmit}
        handleDeleteSpot={handleDeleteSpot}
        isLoading={createSpotMutation.isPending || updateSpotMutation.isPending}
      />

      {/* Add Spot Dialog */}
      <SpotEditDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        title="Add New Spot"
        formData={formData}
        editingSpot={editingSpot}
        updateFormField={updateFormField}
        handleSubmit={handleSubmit}
        handleDeleteSpot={handleDeleteSpot}
        isLoading={createSpotMutation.isPending || updateSpotMutation.isPending}
      />
    </div>
  )
}

// Separate memoized dialog component to prevent re-renders
const SpotEditDialog = memo(function SpotEditDialog({
  isOpen,
  onOpenChange,
  title,
  formData,
  editingSpot,
  updateFormField,
  handleSubmit,
  handleDeleteSpot,
  isLoading,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  formData: {
    spotNumber: string
    status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "UNDER_MAINTENANCE"
    orientation: string
    gridRow: number
    gridCol: number
  }
  editingSpot: any
  updateFormField: (field: string, value: any) => void
  handleSubmit: () => void
  handleDeleteSpot: (spotId: number) => void
  isLoading: boolean
}) {
  return (
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
            <Label htmlFor="spotNumber" className="text-right font-medium">
              Spot Number
            </Label>
            <Input
              id="spotNumber"
              value={formData.spotNumber}
              onChange={(e) => updateFormField("spotNumber", e.target.value)}
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
              onValueChange={(value) => updateFormField("status", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="RESERVED">Reserved</SelectItem>
                <SelectItem value="UNDER_MAINTENANCE">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="orientation" className="text-right font-medium">
              Orientation
            </Label>
            <Select
              value={formData.orientation}
              onValueChange={(value) => updateFormField("orientation", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N">North</SelectItem>
                <SelectItem value="S">South</SelectItem>
                <SelectItem value="E">East</SelectItem>
                <SelectItem value="W">West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gridRow" className="text-right font-medium">
              Row Position
            </Label>
            <Input
              id="gridRow"
              type="number"
              value={formData.gridRow}
              onChange={(e) => updateFormField("gridRow", Number.parseInt(e.target.value) || 0)}
              className="col-span-3"
              min="0"
              max="10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gridCol" className="text-right font-medium">
              Column Position
            </Label>
            <Input
              id="gridCol"
              type="number"
              value={formData.gridCol}
              onChange={(e) => updateFormField("gridCol", Number.parseInt(e.target.value) || 0)}
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
          {editingSpot && (
            <Button variant="destructive" onClick={() => handleDeleteSpot(editingSpot.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (editingSpot ? "Save Changes" : "Add Spot")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
