import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { parkingLots } from "@/server/db/schema";
import { config } from "dotenv";

// Load environment variables
config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const conn = postgres(DATABASE_URL);
const db = drizzle(conn);

async function seed() {
  try {
    console.log("🌱 Seeding database...");
    
    // Check if parking lot already exists
    const existingLots = await db.select().from(parkingLots);
    
    if (existingLots.length === 0) {
      // Create a default parking lot
      const [newLot] = await db
        .insert(parkingLots)
        .values({
          name: "Main Parking Lot",
          location: "Downtown Campus",
          gridRows: 10,
          gridCols: 10,
          rowSpacing: "3m",
          colSpacing: "2.5m",
        })
        .returning();
      
      console.log("✅ Created default parking lot:", newLot);
    } else {
      console.log("✅ Parking lots already exist, skipping seed");
    }
    
    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

seed();
