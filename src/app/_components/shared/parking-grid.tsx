"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Car } from "lucide-react"
import type { ParkingSpot } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ParkingGridProps {
  spots: ParkingSpot[]
  selectedSpotId?: string
  onSpotSelect?: (spot: ParkingSpot) => void
  mode?: "user" | "admin"
}

export function ParkingGrid({ spots, selectedSpotId, onSpotSelect, mode = "user" }: ParkingGridProps) {
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null)

  // Calculate grid dimensions
  const maxX = Math.max(...spots.map((spot) => spot.x))
  const maxY = Math.max(...spots.map((spot) => spot.y))

  // Create a 2D array to represent the grid
  const grid = Array(maxY + 1)
    .fill(null)
    .map(() => Array(maxX + 1).fill(null))

  // Place spots in the grid
  spots.forEach((spot) => {
    grid[spot.y][spot.x] = spot
  })

  const getSpotColor = (spot: ParkingSpot) => {
    if (selectedSpotId === spot.id) {
      return "bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-md"
    }

    switch (spot.status) {
      case "available":
        return "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white border-emerald-500 dark:border-emerald-600"
      case "occupied":
        return "bg-muted hover:bg-muted/80 text-muted-foreground border-muted"
      case "maintenance":
        return "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white border-amber-500 dark:border-amber-600"
      default:
        return "bg-secondary hover:bg-secondary/80 text-secondary-foreground border-secondary"
    }
  }

  const getRotationClass = (orientation: string) => {
    switch (orientation) {
      case "north":
        return "rotate-0"
      case "south":
        return "rotate-180"
      case "east":
        return "rotate-90"
      case "west":
        return "rotate-270"
      default:
        return "rotate-0"
    }
  }

  const isSpotClickable = (spot: ParkingSpot) => {
    if (mode === "admin") return true
    return spot.status === "available"
  }

  const getTooltipContent = (spot: ParkingSpot) => {
    const statusText = spot.status.charAt(0).toUpperCase() + spot.status.slice(1)
    return `Spot ${spot.number} - ${statusText}`
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
                      <span className="text-xs font-semibold">{spot.number}</span>
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
