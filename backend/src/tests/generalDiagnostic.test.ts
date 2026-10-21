import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { WorkstationModel } from "../models/HardwareClient";
import { executeDiagnosticForWorkstation } from "../services/diagnostic.service";

dotenv.config({ path: path.resolve(__dirname, process.cwd(), ".env") });

const mongoUri = process.env.MONGODB_URI;
console.log(mongoUri);
async function runDiagnosticTest() {
  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI it's not defined in enviroment variables");
    }
    await mongoose.connect(mongoUri);
    console.log("Connecting to MongoDB Atlas succesfully");

    const existingWorkstationId = "6ab0301d2c5fa71a0ec0d97c";

    const workstation = await WorkstationModel.findById(existingWorkstationId);

    if (!workstation) {
      throw new Error(
        `workstation with ID: ${existingWorkstationId} not found`,
      );
    }
    console.log(
      `Workstation with ID ${existingWorkstationId} found, ${workstation.system_info.brand}, ${workstation.system_info.model}`,
    );

    console.log("\n--- Ejecutando Motor de Diagnóstico ---");
    const result = await executeDiagnosticForWorkstation(
      workstation._id.toString(),
      "3D Animation",
      "viewport_lag_low_fps",
    );

    console.log("\n=== RESULTADO DEL DIAGNÓSTICO ===");
    console.log(JSON.stringify(result, null, 2));

    await mongoose.disconnect();
    console.log("\nConexión cerrada.");
  } catch (error) {
    console.error("Error en la prueba:", error);
    await mongoose.disconnect();
  }
}

runDiagnosticTest();

describe("General Diagnostic placeholder", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});
