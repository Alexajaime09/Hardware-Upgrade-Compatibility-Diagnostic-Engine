export interface PowerValidationInput {
  psu_wattage_installed: number;
  available_psu_upgrades: number[];
  cpu_tdp_w: number;
  gpu_tdp_w: number;
  system_base_consumption_w?: number;
}

export interface RuleResult {
  is_compatible: boolean;
  calculated_wattage_required: number;
  warnings: string[];
  required_psu_upgrade_w?: number;
}

export function validatePowerSupply(input: PowerValidationInput): RuleResult {
  const baseConsumption = input.system_base_consumption_w ?? 50;
  const rawSum = input.cpu_tdp_w + input.gpu_tdp_w + baseConsumption;

  const requiredWattage = Math.ceil(rawSum * 1.25);
  if (requiredWattage <= input.psu_wattage_installed) {
    return {
      is_compatible: true,
      calculated_wattage_required: requiredWattage,
      warnings: [],
    };
  }

  const suitableUpgrade = input.available_psu_upgrades
    .sort((a, b) => a - b)
    .find((w) => w >= requiredWattage);

  if (suitableUpgrade) {
    return {
      is_compatible: true,
      calculated_wattage_required: requiredWattage,
      warnings: [
        `The current ${input.psu_wattage_installed}W power supply does not meet the required power consumption of ${requiredWattage}W`,
      ],
      required_psu_upgrade_w: suitableUpgrade,
    };
  }

  return {
    is_compatible: false,
    calculated_wattage_required: requiredWattage,
    warnings: [
      `The required consumption (${requiredWattage}W) exceeds the maximum capacity of the sources supported by chassis`,
    ],
  };
}
