"use client"

import { ParkingGrid } from "@/app/_components/shared/parking-grid"

interface ParkingLotViewProps {
  spots: any[]
  selectedSpotId?: string
  onSpotSelect: (spot: any) => void
}

export function ParkingLotView({ spots, selectedSpotId, onSpotSelect }: ParkingLotViewProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-balance">AuraPark Parking Lot</h2>
        <p className="text-muted-foreground">Click on an available spot to select it</p>
      </div>
      <ParkingGrid
        spots={spots}
        selectedSpotId={selectedSpotId}
        onSpotSelect={onSpotSelect}
        mode="user"
      />
    </div>
  )
}
