//src/engine/diagnostic.engine.ts
import {
  PhysicalValidationInput,
  validatePhysicalConstrains,
} from "./rules/physical.rule";
import {
  validateRamConstraints,
  SystemRamSpec,
  TargetRamConfiguration,
} from "./rules/ram.rule";
import { PowerValidationInput, validatePowerSupply } from "./rules/power.rule";
import {
  SystemPcieSpec,
  TargetPcieConfiguration,
  validatePcieConstraints,
} from "./rules/pcie.rule";

export interface DiagnosticRequest {
  profile:
    | "3D Animation"
    | "Video Editor"
    | "Motion Graphics Artist"
    | "Streamer";
  symptom: string;
  physicalInput: PhysicalValidationInput;
  component_category: string;
  powerInput: PowerValidationInput;
  pcieSystemSpec: SystemPcieSpec;
  pcieTargetConfig: TargetPcieConfiguration;
  ramSystemSpec: SystemRamSpec;
  ramTargetConfig: TargetRamConfiguration;
}

export interface DiagnosticResult {
  is_fully_compatible: boolean;
  profile: string;
  symptom_analyzed: string;
  component_category: string;
  consolidated_warnings: string[];
  recommendations: {
    calculated_ram_capacity_gb: number;
    calculated_power_wattage_required?: number;
    required_psu_upgrade_w?: number;
    gpu_upgrade_suggested?: string; // <-- Nuevo campo para sugerir cambio de GPU
    requires_system_replacement: boolean;
  };
}

export function runDiagnosticEngine(
  request: DiagnosticRequest,
): DiagnosticResult {
  const consolidateWarnings: string[] = [];

  const physicalRes = validatePhysicalConstrains(request.physicalInput);
  if (!physicalRes.is_compatible) {
    consolidateWarnings.push(...physicalRes.warnings);
  } else if (physicalRes.warnings.length > 0) {
    // Si hay advertencias pero es compatible (ej: insuficiencia blanda de GPU)
    consolidateWarnings.push(...physicalRes.warnings);
  }

  const powerRes = validatePowerSupply(request.powerInput);

  if (!powerRes.is_compatible) {
    consolidateWarnings.push(...powerRes.warnings);
  } else if (powerRes.warnings.length > 0) {
    consolidateWarnings.push(...powerRes.warnings);
  }

  const pcieRes = validatePcieConstraints(
    request.pcieSystemSpec,
    request.pcieTargetConfig,
  );

  if (!pcieRes.is_compatible) {
    consolidateWarnings.push(...perResWarnings(pcieRes.warnings)); // o pcieRes.warnings directamente
  }

  const ramRes = validateRamConstraints(
    request.ramSystemSpec,
    request.ramTargetConfig,
  );

  if (!ramRes.is_compatible) {
    consolidateWarnings.push(...ramRes.warnings);
  }

  const isFullyCompatible =
    physicalRes.is_compatible &&
    powerRes.is_compatible &&
    pcieRes.is_compatible &&
    ramRes.is_compatible;

  const requiresReplacement =
    request.physicalInput.gpu_length_mm >
      request.physicalInput.max_gpu_length_mm ||
    request.physicalInput.gpu_slots > request.physicalInput.max_gpu_slots ||
    !pcieRes.is_compatible;

  return {
    is_fully_compatible: isFullyCompatible,
    profile: request.profile,
    symptom_analyzed: request.symptom,
    component_category: request.component_category,
    consolidated_warnings: consolidateWarnings,
    recommendations: {
      calculated_ram_capacity_gb: ramRes.total_capacity_gb,
      calculated_power_wattage_required: powerRes.calculated_wattage_required,
      required_psu_upgrade_w: powerRes.required_psu_upgrade_w,
      gpu_upgrade_suggested: physicalRes.gpu_upgrade_suggested,
      requires_system_replacement: requiresReplacement,
    },
  };
}

function perResWarnings(warnings: string[]) {
  return warnings;
}
