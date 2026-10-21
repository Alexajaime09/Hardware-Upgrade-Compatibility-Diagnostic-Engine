import { OptimizedProfileModel } from "../models/optimizedProfile.model";
import { WorkstationModel } from "../models/HardwareClient";
import mongoose, { Types } from "mongoose";

import {
  runDiagnosticEngine,
  DiagnosticRequest,
  DiagnosticResult,
} from "../engine/diagnostic.engine";

export async function executeDiagnosticForWorkstation(
  workstationId: string | Types.ObjectId,
  profileName:
    | "3D Animation"
    | "Video Editor"
    | "Motion Graphics Artist"
    | "Streamer",
  symptomKey: string,
): Promise<DiagnosticResult> {
  const objectId =
    typeof workstationId === "string"
      ? new Types.ObjectId(workstationId)
      : workstationId;

  const workstation = await WorkstationModel.findById(objectId);

  if (!workstation) {
    throw new Error(
      `Workstation with ID ${workstation} not found in the data base `,
    );
  }

  const profileSelected = await OptimizedProfileModel.findOne({
    profile: profileName,
    symptom_key: symptomKey,
  });

  if (!profileSelected) {
    throw new Error(
      `The technical profile '${profileName}' with symptom '${symptomKey}' not found.`,
    );
  }

  const pcieX16Count = workstation.motherboard_expansion.pcie_slots.filter(
    (slot) => slot.size === "x16" || slot.lanes === 16,
  ).length;

  const moduleCount = 2;
  const capacityPerModule = Math.ceil(
    profileSelected.target_required_ram_gb / moduleCount,
  );

  const diagnosticRequest: DiagnosticRequest = {
    profile: profileSelected.profile as any,
    symptom: profileSelected.symptom_key,
    component_category: profileSelected.component_category,
    physicalInput: {
      max_gpu_slots: workstation.physical_constraints.max_gpu_slots,
      max_gpu_length_mm: workstation.physical_constraints.max_gpu_length_mm,
      gpu_slots: profileSelected.target_gpu_slots,
      gpu_length_mm: profileSelected.target_gpu_length_mm,
    },

    powerInput: {
      psu_wattage_installed:
        workstation.power_supply.installed_wattage_w ?? 750,
      available_psu_upgrades: workstation.power_supply.available_wattages_w,
      cpu_tdp_w: profileSelected.cpu_tdp_w,
      gpu_tdp_w: profileSelected.gpu_tdp_w,
    },

    pcieSystemSpec: {
      pcie_x16_slots_count: pcieX16Count,

      supported_generation: workstation.motherboard_expansion.pcie_slots[0]?.gen
        ? `PCIe ${workstation.motherboard_expansion.pcie_slots[0].gen}.0`
        : "PCIe 4.0",
    },

    pcieTargetConfig: {
      minimum_form_factor: profileSelected.minimum_form_factor,
      required_generation: profileSelected.required_generation,
    },

    ramSystemSpec: {
      ram_slots_count: workstation.motherboard_expansion.ram_slots_count,
      max_ram_gb: workstation.motherboard_expansion.max_ram_gb,
      supported_technologies:
        workstation.motherboard_expansion.supported_ram_technologies,
    },

    ramTargetConfig: {
      module_count: moduleCount,
      capacity_per_module_gb: capacityPerModule,
      technology: profileSelected.required_generation,
      is_ecc: false,
    },
  };

  const result = runDiagnosticEngine(diagnosticRequest);
  return result;
}
