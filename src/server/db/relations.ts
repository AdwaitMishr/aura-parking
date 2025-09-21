// src/server/db/relations.ts
import { relations } from "drizzle-orm";
import { parkingLots, parkingSpots, bookings, user, account, session } from "./schema";

export const parkingLotsRelations = relations(parkingLots, ({ many }) => ({
  spots: many(parkingSpots),
}));

export const parkingSpotsRelations = relations(parkingSpots, ({ one, many }) => ({
  parkingLot: one(parkingLots, {
    fields: [parkingSpots.parkingLotId],
    references: [parkingLots.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(user, {
    fields: [bookings.userId],
    references: [user.id],
  }),
  parkingSpot: one(parkingSpots, {
    fields: [bookings.parkingSpotId],
    references: [parkingSpots.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  bookings: many(bookings),
  sessions: many(session),
  accounts: many(account),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));