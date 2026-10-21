import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db";
import { WorkstationModel } from "./models/HardwareClient";

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI!;

    await connectDatabase(mongoUri);

    const dataDir = path.join(
      __dirname,
      "../../data/systems/desktop/lenovo/thinkstation_p3",
    );

    const file2023 = JSON.parse(
      fs.readFileSync(path.join(dataDir, "2023.json"), "utf-8"),
    );
    const file2024 = JSON.parse(
      fs.readFileSync(path.join(dataDir, "2024.json"), "utf-8"),
    );

    const systemsToSeed = [file2023, file2024];

    await WorkstationModel.deleteMany({});
    console.log("data base cleaned");

    const insertedDocs = await await WorkstationModel.insertMany(systemsToSeed);
    console.log(`documents inserted, ${insertedDocs.length}`);
    process.exit(0);
  } catch (error) {
    console.error("error in charge seeding", error);
    process.exit(1);
  }
};

seedDatabase();
