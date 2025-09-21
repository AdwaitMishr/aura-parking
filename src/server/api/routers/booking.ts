import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { bookings, parkingSpots } from "@/server/db";
import { eq, and, gte, lt, gt } from "drizzle-orm";

export const bookingRouter = createTRPCRouter({
  /**
   * Creates a new booking after validating availability.
   */
  create: protectedProcedure
    .input(
      z.object({
        parkingSpotId: z.number(),
        startTime: z.date().or(z.string().transform(str => new Date(str))),
        endTime: z.date().or(z.string().transform(str => new Date(str))),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate the time range
      if (input.startTime >= input.endTime) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "End time must be after start time." });
      }
      if (input.startTime < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot book for a past time." });
      }
      
      // Check if spot exists and is not under maintenance
      const spot = await ctx.db.query.parkingSpots.findFirst({
        where: eq(parkingSpots.id, input.parkingSpotId),
      });
      
      if (!spot) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Parking spot not found." });
      }
      if (spot.status === "UNDER_MAINTENANCE") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This spot is under maintenance." });
      }
      
      /**
       * Check for overlapping bookings using a simplified, single condition.
       * An overlap exists if an existing booking starts before the new one ends,
       * AND it ends after the new one starts. This covers all cases.
       */
      const overlappingBooking = await ctx.db.query.bookings.findFirst({
        where: and(
          eq(bookings.parkingSpotId, input.parkingSpotId),
          lt(bookings.startTime, input.endTime), // existing.start < new.end
          gt(bookings.endTime, input.startTime)  // existing.end > new.start
        ),
      });
      
      if (overlappingBooking) {
        throw new TRPCError({ code: "CONFLICT", message: "This spot is already booked for the selected time." });
      }
      
      // Create the booking
      const [newBooking] = await ctx.db
        .insert(bookings)
        .values({
          userId: ctx.user.id,
          parkingSpotId: input.parkingSpotId,
          startTime: input.startTime,
          endTime: input.endTime,
        })
        .returning();
      
      return newBooking;
    }),

  /**
   * Cancels a user's own upcoming booking.
   */
  cancel: protectedProcedure
    .input(z.object({ bookingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Find the booking to ensure it exists and belongs to the user
      const [booking] = await ctx.db
        .select()
        .from(bookings)
        .where(and(eq(bookings.id, input.bookingId), eq(bookings.userId, ctx.user.id)));
      
      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found or you don't have permission." });
      }
      if (booking.startTime <= new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot cancel a booking that has already started." });
      }
      
      await ctx.db.delete(bookings).where(eq(bookings.id, input.bookingId));
      return { success: true };
    }),
    
  /**
   * Allows an Admin to cancel any booking.
   */
  cancelByAdmin: adminProcedure
    .input(z.object({ bookingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
        const [booking] = await ctx.db.select().from(bookings).where(eq(bookings.id, input.bookingId));
        if (!booking) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found." });
        }
        await ctx.db.delete(bookings).where(eq(bookings.id, input.bookingId));
        return { success: true };
    }),

  /**
   * Gets a user's bookings (upcoming by default, or all including past).
   */
  getUserBookings: protectedProcedure
    .input(z.object({ includeHistory: z.boolean().default(false) }))
    .query(({ ctx, input }) => {
      // Build the `where` conditions dynamically
      const conditions = [eq(bookings.userId, ctx.user.id)];
      if (!input.includeHistory) {
        conditions.push(gte(bookings.endTime, new Date()));
      }

      // Use Drizzle's relational queries for a cleaner join
      return ctx.db.query.bookings.findMany({
        where: and(...conditions),
        with: {
          parkingSpot: true, // This automatically joins parkingSpots
        },
        orderBy: (b, { asc }) => [asc(b.startTime)],
      });
    }),
});