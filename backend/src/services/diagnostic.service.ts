import { OptimizedProfileModel } from "../models/optimizedProfile.model";
import { WorkstationModel } from "../models/HardwareClient";
import mongoose, { Types } from "mongoose";

import {
  runDiagnosticEngine,
  DiagnosticRequest,
  DiagnosticResult,
} from "../engine/diagnostic.engine";

export interface UserHardwareConfig {
  cpu?: string;
  ramGb?: number;
  gpuModel?: string;
  storageType?: string;
}

function estimateUserGpuVram(gpuModelName?: string): number {
  if (!gpuModelName) return 12;
  const name = gpuModelName.toUpperCase();
  if (name.includes("4090") || name.includes("3090") || name.includes("6000"))
    return 24;
  if (name.includes("4080") || name.includes("A5000") || name.includes("5000"))
    return 16;
  if (name.includes("4070") || name.includes("3080")) return 12;
  if (
    name.includes("4060") ||
    name.includes("3070") ||
    name.includes("3060") ||
    name.includes("A4000") ||
    name.includes("T1000")
  )
    return 8;
  if (name.includes("A400") || name.includes("T400") || name.includes("W6300"))
    return 4;
  return 8;
}

export async function executeDiagnosticForWorkstation(
  workstationId: string | Types.ObjectId,
  profileName:
    | "3D Animation"
    | "Video Editor"
    | "Motion Graphics Artist"
    | "Streamer",
  symptomKey: string,
  userHardware?: UserHardwareConfig,
): Promise<DiagnosticResult> {
  const objectId =
    typeof workstationId === "string"
      ? new Types.ObjectId(workstationId)
      : workstationId;

  const workstation = await WorkstationModel.findById(objectId);

  if (!workstation) {
    throw new Error(
      `Workstation with ID ${workstationId} not found in the database`,
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

  const userRamInstalled = userHardware?.ramGb
    ? Number(userHardware.ramGb)
    : 32;
  const requiredRam = profileSelected.target_required_ram_gb;

  const userGpuModel =
    userHardware?.gpuModel || "NVIDIA GeForce RTX 4060 (8GB)";
  const userGpuVram = estimateUserGpuVram(userGpuModel);

  const targetMinVram = profileSelected.target_min_vram_gb || 16;
  const targetGpuModelName =
    profileSelected.target_gpu_model_name ||
    "NVIDIA RTX 5000 Ada / GeForce RTX 4090";

  const moduleCount = 2;
  const capacityPerModule = Math.ceil(userRamInstalled / moduleCount);
  const supportedRamTech =
    workstation.motherboard_expansion.supported_ram_technologies?.[0] ||
    "DDR5-5600 non-ECC UDIMM";

  const diagnosticRequest: DiagnosticRequest = {
    profile: profileSelected.profile as any,
    symptom: profileSelected.symptom_key,
    component_category: profileSelected.component_category,

    physicalInput: {
      max_gpu_slots: workstation.physical_constraints.max_gpu_slots,
      max_gpu_length_mm: workstation.physical_constraints.max_gpu_length_mm,
      gpu_slots: profileSelected.target_gpu_slots,
      gpu_length_mm: profileSelected.target_gpu_length_mm,
      user_gpu_vram_gb: userGpuVram,
      target_min_vram_gb: targetMinVram,
      target_gpu_model_name: targetGpuModelName,
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
      supported_technologies: workstation.motherboard_expansion
        .supported_ram_technologies || [supportedRamTech],
    },

    ramTargetConfig: {
      module_count: moduleCount,
      capacity_per_module_gb: capacityPerModule,
      technology: supportedRamTech,
      is_ecc: false,
      required_ram_gb: requiredRam,
      user_installed_ram_gb: userRamInstalled,
    },
  };

  const result = runDiagnosticEngine(diagnosticRequest);

  return {
    ...result,
    recommendations: {
      ...result.recommendations,
      user_gpu_evaluated: userGpuModel,
    },
  } as any;
}
