// src/seed.ts
import dotenv from "dotenv";
import { connectDatabase } from "./config/db";
import { seedOptimizedProfiles } from "./profileSeed/optimizedProfile.seed";

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI!;

    await connectDatabase(mongoUri);

    // Ejecutamos directamente el seed de perfiles optimizados en MongoDB Atlas
    await seedOptimizedProfiles();

    console.log("Seed process completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error in charge seeding:", error);
    process.exit(1);
  }
};

seedDatabase();
