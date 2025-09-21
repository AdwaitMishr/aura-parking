
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, pgTableCreator, pgEnum, serial, integer } from "drizzle-orm/pg-core";
export const createTable = pgTableCreator((name) => `aura-parking_${name}`);


export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);
export const spotStatusEnum = pgEnum('spot_status', ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'UNDER_MAINTENANCE']); 

export const parkingLots = createTable('parking_lots', {
    id: serial('id').primaryKey().notNull(),
    name: text('name').notNull(),
    location: text('location'),
    gridRows: integer('grid_rows').notNull().default(10),
    gridCols: integer('grid_columns').notNull().default(10),
    rowSpacing: text('row_spacing'),
    colSpacing: text('col_spacing'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: "date" }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const parkingSpots = createTable('parking_spots', {
    id: serial('id').primaryKey().notNull(),
    spotNumber: text('spot_number').notNull(),
    parkingLotId: integer('parking_lot_id').notNull().references(() => parkingLots.id, { onDelete: 'cascade' }),
    gridRow: integer('grid_row').notNull(),
    gridCol: integer('grid_column').notNull(),
    orientation: text('orientation').default('N'),
    status: spotStatusEnum('status').notNull().default('AVAILABLE'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: "date" }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: "date" }).defaultNow().$onUpdate(() => new Date()),
});

export const bookings = createTable('bookings', {
    id: serial('id').primaryKey().notNull(),
    startTime: timestamp('start_time', { withTimezone: true, mode: "date" }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true, mode: "date" }).notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    parkingSpotId: integer('parking_spot_id').notNull().references(() => parkingSpots.id, { onDelete: 'cascade' }),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  role: userRoleEnum("role").default('USER').notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});


