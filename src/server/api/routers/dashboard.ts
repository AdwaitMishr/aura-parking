import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { parkingLots, bookings } from "@/server/db"; // Use the main db index
import { eq, and, gte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const dashboardRouter = createTRPCRouter({
  getUserDashboardData: protectedProcedure
    .input(z.object({ parkingLotId: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      
      const parkingLotWithSpotsPromise = ctx.db.query.parkingLots.findFirst({
        where: eq(parkingLots.id, input.parkingLotId),
        with: {
          // This now correctly matches the 'spots' relation in db/index.ts
          spots: { 
            orderBy: (spot, { asc }) => [asc(spot.gridRow), asc(spot.gridCol)],
          },
        },
      });

      const userBookingsPromise = ctx.db.query.bookings.findMany({
        where: and(
          eq(bookings.userId, ctx.user.id),
          gte(bookings.endTime, new Date())
        ),
        with: {
          parkingSpot: true,
        },
        orderBy: (b, { asc }) => [asc(b.startTime)],
      });

      const [parkingLotData, userBookings] = await Promise.all([
        parkingLotWithSpotsPromise,
        userBookingsPromise,
      ]);

      if (!parkingLotData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parking lot not found",
        });
      }

      return {
        parkingLot: parkingLotData,
        userBookings,
      };
    }),

  getAllParkingLots: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.parkingLots.findMany({
      orderBy: (lots, { asc }) => [asc(lots.name)],
    });
  }),
});