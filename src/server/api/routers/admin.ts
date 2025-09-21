// src/server/api/routers/admin.ts
import { z } from "zod";
import { count, eq } from "drizzle-orm";

import {
  adminProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { user, bookings, parkingLots, parkingSpots, spotStatusEnum } from "@/server/db";

export const adminRouter = createTRPCRouter({
  /**
   * Procedure for the "Overview" tab. Fetches key stats.
   */
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const totalUsersPromise = ctx.db.select({ value: count() }).from(user);
    const totalBookingsPromise = ctx.db.select({ value: count() }).from(bookings);
    
    // Run queries in parallel for efficiency
    const [totalUsers, totalBookings] = await Promise.all([
        totalUsersPromise,
        totalBookingsPromise,
    ]);

    // TODO: Implement a more complex query for peak usage time
    const peakTime = "2:00 PM"; 

    return {
      totalUsers: totalUsers[0]?.value ?? 0,
      totalBookings: totalBookings[0]?.value ?? 0,
      peakTime,
    };
  }),

  /**
   * Procedure for the "Booking Records" tab. Fetches all bookings with user/spot details.
   */
  getAllBookings: adminProcedure.query(async ({ ctx }) => {
    // This uses the relations we defined in db/index.ts to easily join tables
    return ctx.db.query.bookings.findMany({
      with: {
        user: { columns: { name: true, email: true } },
        parkingSpot: { columns: { spotNumber: true } },
      },
      orderBy: (b, { desc }) => [desc(b.startTime)],
    });
  }),
  
  /**
   * Procedure for creating a new parking lot.
   */
  createParkingLot: adminProcedure
    .input(z.object({
        name: z.string().min(3),
        location: z.string().min(3),
        gridRows: z.number().min(1),
        gridCols: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
        const [newLof] = await ctx.db
            .insert(parkingLots)
            .values({ ...input })
            .returning();
        return newLof;
    }),

  /**
   * Procedure for the "Spot Management" tab. Fetches a lot and its spots.
   */
  getParkingLotForManagement: adminProcedure
    .input(z.object({ parkingLotId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.parkingLots.findFirst({
        where: eq(parkingLots.id, input.parkingLotId),
        with: { spots: true }, // 'spots' comes from the relation we defined
      });
    }),

  /**
   * Procedure for updating a parking spot from the "Edit Spot" dialog.
   */
  updateParkingSpot: adminProcedure
    .input(z.object({
        spotId: z.number(),
        status: z.enum(spotStatusEnum.enumValues),
        spotNumber: z.string().min(1),
        // Add other fields from your "Edit Spot" form here
    }))
    .mutation(async ({ ctx, input }) => {
        await ctx.db
            .update(parkingSpots)
            .set({ 
                status: input.status,
                spotNumber: input.spotNumber,
             })
            .where(eq(parkingSpots.id, input.spotId));
        return { success: true };
    }),
});