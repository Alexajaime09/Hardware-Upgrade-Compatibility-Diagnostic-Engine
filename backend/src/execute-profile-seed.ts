import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedOptimizedProfiles } from "./profileSeed/oprtimizedProfile.seed";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGODB_URI!;
console.log(mongoUri);
async function run() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    await seedOptimizedProfiles();

    await mongoose.disconnect();
    console.log("Seed executed and connection closed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

run();
