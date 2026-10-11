import {
  validatePowerSupply,
  PowerValidationInput,
} from "../engine/rules/power.rule";

describe("Power Supplay Diagnostic & Recommendation Filter Rule (power.rule)", () => {
  test("should approve configuration within installed PSU capacity", () => {
    const input: PowerValidationInput = {
      psu_wattage_installed: 750,
      available_psu_upgrades: [1000],
      cpu_tdp_w: 125,
      gpu_tdp_w: 250,
    };

    const result = validatePowerSupply(input);

    expect(result.is_compatible).toBe(true);
    expect(result.warnings).toHaveLength(0);
    expect(result.required_psu_upgrade_w).toBeUndefined();
  });

  test("should suggest PSU upgrade if installed wattage is insufficient but upgrade is available", () => {
    const input: PowerValidationInput = {
      psu_wattage_installed: 500,
      available_psu_upgrades: [750, 1000],
      cpu_tdp_w: 150,
      gpu_tdp_w: 350,
    };

    const result = validatePowerSupply(input);

    expect(result.is_compatible).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.required_psu_upgrade_w).toBe(750);
  });

  test("should reject configuration if required power exceeds all available upgrades", () => {
    const input: PowerValidationInput = {
      psu_wattage_installed: 300,
      available_psu_upgrades: [500],
      cpu_tdp_w: 250,
      gpu_tdp_w: 450,
    };
    const result = validatePowerSupply(input);

    expect(result.is_compatible).toBe(false);
    expect(result.warnings[0]).toContain("exceeds the maximum capacity");
  });
});
