import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "./schema";
import * as relations from "./relations"; // <-- 1. Import your new relations file

/**
 * Cache the database connection in development.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// 2. Combine the schema and relations into one object for Drizzle
const combinedSchema = { ...schema, ...relations };

// 3. Pass the combined schema to Drizzle
export const db = drizzle(conn, { 
  schema: combinedSchema,
  logger: env.NODE_ENV === "development",
});

// 4. Re-export everything from your schema file for easy access in other files
export * from "./schema";