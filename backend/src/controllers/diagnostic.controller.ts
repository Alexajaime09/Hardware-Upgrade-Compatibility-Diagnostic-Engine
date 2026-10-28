import { Request, Response } from "express";
import { executeDiagnosticForWorkstation } from "../services/diagnostic.service";

export async function runDiagnosticController(req: Request, res: Response) {
  try {
    const {
      workstationId,
      profileName,
      symptomKey,
      cpu,
      ramGb,
      gpuModel,
      storageType,
    } = req.body;

    if (!workstationId || !profileName || !symptomKey) {
      return res.status(400).json({
        success: false,
        message:
          "Required parameters are missing: workstationId, profileName and symptomKey are mandatory",
      });
    }

    const result = await executeDiagnosticForWorkstation(
      workstationId,
      profileName,
      symptomKey,
      { cpu, ramGb, gpuModel, storageType },
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error in diagnostic controller", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal error while processing the diagnosis",
    });
  }
}
