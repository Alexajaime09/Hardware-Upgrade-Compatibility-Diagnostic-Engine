export interface SystemPcieSpec {
  pcie_x16_slots_count: number;
  supported_generation: string;
}

export interface TargetPcieConfiguration {
  minimum_form_factor: string;
  required_generation: string;
}

export interface PcieRuleResult {
  is_compatible: boolean;
  warnings: string[];
}

export function validatePcieConstraints(
  system: SystemPcieSpec,
  target: TargetPcieConfiguration,
): PcieRuleResult {
  const warnings: string[] = [];
  if (system.pcie_x16_slots_count < 1) {
    warnings.push(
      `System lacks required PCIe ${target.minimum_form_factor} expansion slots`,
    );
  }

  if (
    system.supported_generation === "PCIe 3.0" &&
    target.required_generation === "PCIe 5.0"
  ) {
    warnings.push(
      `System PCIe generation (${system.supported_generation}) is older than component requirement (${target.required_generation})`,
    );
  }

  return {
    is_compatible: warnings.length === 0,
    warnings,
  };
}
