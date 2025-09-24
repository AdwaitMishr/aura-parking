"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Car } from "lucide-react"
// TODO: Replace with proper types from backend schema
import { cn } from "@/lib/utils"

interface ParkingGridProps {
  spots: any[] // TODO: Replace with proper ParkingSpot type from backend
  selectedSpotId?: string
  onSpotSelect?: (spot: any) => void
  mode?: "user" | "admin"
}

export function ParkingGrid({ spots, selectedSpotId, onSpotSelect, mode = "user" }: ParkingGridProps) {
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null)

  // Calculate grid dimensions - map database fields correctly
  const maxX = spots.length > 0 ? Math.max(...spots.map((spot) => spot.gridCol || 0)) : 0
  const maxY = spots.length > 0 ? Math.max(...spots.map((spot) => spot.gridRow || 0)) : 0

  // Create a 2D array to represent the grid
  const grid = Array(maxY + 1)
    .fill(null)
    .map(() => Array(maxX + 1).fill(null))

  // Place spots in the grid
  spots.forEach((spot) => {
    if (spot && spot.gridRow !== undefined && spot.gridCol !== undefined && grid[spot.gridRow]) {
      grid[spot.gridRow]![spot.gridCol] = spot
    }
  })

  const getSpotColor = (spot: any) => {
    if (selectedSpotId === spot.id) {
      return "bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-md"
    }

    switch (spot.status) {
      case "AVAILABLE":
        return "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white border-emerald-500 dark:border-emerald-600"
      case "OCCUPIED":
        return "bg-muted hover:bg-muted/80 text-muted-foreground border-muted"
      case "RESERVED":
        return "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-blue-500 dark:border-blue-600"
      case "UNDER_MAINTENANCE":
        return "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white border-amber-500 dark:border-amber-600"
      default:
        return "bg-secondary hover:bg-secondary/80 text-secondary-foreground border-secondary"
    }
  }

  const getRotationClass = (orientation: string) => {
    switch (orientation) {
      case "N":
        return "rotate-0"
      case "S":
        return "rotate-180"
      case "E":
        return "rotate-90"
      case "W":
        return "rotate-270"
      default:
        return "rotate-0"
    }
  }

  const isSpotClickable = (spot: any) => {
    if (mode === "admin") return true
    return spot.status === "AVAILABLE"
  }

  const getSpotIcon = (spot: any) => {
    const statusText = spot.status.charAt(0).toUpperCase() + spot.status.slice(1).toLowerCase()
    return `Spot ${spot.spotNumber} - ${statusText}`
  }

  const getTooltipContent = (spot: any) => {
    const statusText = spot.status.charAt(0).toUpperCase() + spot.status.slice(1).toLowerCase()
    return `Spot ${spot.spotNumber} - ${statusText}`
  }

  return (
    <TooltipProvider>
      <div className="bg-card rounded-xl p-6 border shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-balance">Parking Layout</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 dark:bg-emerald-600 rounded-sm"></div>
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded-sm"></div>
              <span className="text-muted-foreground">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-sm"></div>
              <span className="text-muted-foreground">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 dark:bg-amber-600 rounded-sm"></div>
              <span className="text-muted-foreground">Maintenance</span>
            </div>
            {selectedSpotId && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                <span className="text-muted-foreground">Selected</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${maxX + 1}, 1fr)` }}>
          {grid.map((row, y) =>
            row.map((spot, x) => {
              if (!spot) {
                // Empty space or aisle
                return (
                  <div key={`empty-${y}-${x}`} className="h-16 flex items-center justify-center">
                    {y === 1 && <div className="text-xs text-muted-foreground font-medium">Aisle</div>}
                    {y === 3 && <div className="text-xs text-muted-foreground font-medium">Aisle</div>}
                  </div>
                )
              }

              return (
                <Tooltip key={spot.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-16 w-full flex flex-col items-center justify-center gap-1 transition-all duration-300 rounded-lg",
                        getSpotColor(spot),
                        !isSpotClickable(spot) && "cursor-not-allowed opacity-60",
                        hoveredSpot === spot.id && "scale-105 shadow-lg",
                      )}
                      onClick={() => {
                        if (isSpotClickable(spot) && onSpotSelect) {
                          onSpotSelect(spot)
                        }
                      }}
                      onMouseEnter={() => setHoveredSpot(spot.id)}
                      onMouseLeave={() => setHoveredSpot(null)}
                      disabled={!isSpotClickable(spot) && mode === "user"}
                    >
                      <Car className={cn("h-4 w-4", getRotationClass(spot.orientation))} />
                      <span className="text-xs font-semibold">{spot.spotNumber}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getTooltipContent(spot)}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }),
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
