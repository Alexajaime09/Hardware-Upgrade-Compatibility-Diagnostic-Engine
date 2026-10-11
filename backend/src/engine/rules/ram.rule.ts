// src/rules/ram.rule.ts

export interface SystemRamSpec {
  ram_slots_count: number;
  max_ram_gb: number;
  supported_technologies: string[];
}

export interface TargetRamConfiguration {
  module_count: number;
  capacity_per_module_gb: number;
  technology: string;
  is_ecc: boolean;
}

export interface RamRuleResult {
  is_compatible: boolean;
  total_capacity_gb: number;
  warnings: string[];
}

export function validateRamConstraints(
  system: SystemRamSpec,
  target: TargetRamConfiguration,
): RamRuleResult {
  const warnings: string[] = [];
  const totalCapacityGb = target.module_count * target.capacity_per_module_gb;

  if (target.module_count > system.ram_slots_count) {
    warnings.push(
      `Target module count (${target.module_count}) exceeds available slots (${system.ram_slots_count}).`,
    );
  }

  if (totalCapacityGb > system.max_ram_gb) {
    warnings.push(
      `Total memory capacity (${totalCapacityGb} GB) exceeds maximum system limit (${system.max_ram_gb} GB).`,
    );
  }

  if (!system.supported_technologies.includes(target.technology)) {
    warnings.push(
      `Memory technology '${target.technology}' is not supported by this system.`,
    );
  }

  if (target.capacity_per_module_gb === 8 && target.is_ecc) {
    warnings.push(
      `8 GB modules with ECC technology are not supported by system architecture.`,
    );
  }

  return {
    is_compatible: warnings.length === 0,
    total_capacity_gb: totalCapacityGb,
    warnings,
  };
}
