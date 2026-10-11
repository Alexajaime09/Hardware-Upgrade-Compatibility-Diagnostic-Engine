import {
  validatePcieConstraints,
  SystemPcieSpec,
  TargetPcieConfiguration,
} from "../engine/rules/pcie.rule";

describe("PCIe Diagnostic & Recommendation Filter Rule (pcie.rule)", () => {
  const baseSystemSpec: SystemPcieSpec = {
    pcie_x16_slots_count: 2,
    supported_generation: "PCIe 5.0",
  };

  test("should approve configuration matching PCIe slots and generation", () => {
    const targetConfig: TargetPcieConfiguration = {
      minimum_form_factor: "x16",
      required_generation: "PCIe 4.0",
    };
    const result = validatePcieConstraints(baseSystemSpec, targetConfig);

    expect(result.is_compatible).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  test("should reject configuration if system lacks required PCIe x16 slots", () => {
    const restrictedSystem: SystemPcieSpec = {
      pcie_x16_slots_count: 0,
      supported_generation: "PCIe 4.0",
    };

    const targetConfig: TargetPcieConfiguration = {
      minimum_form_factor: "x16",
      required_generation: "PCIe 4.0",
    };

    const result = validatePcieConstraints(restrictedSystem, targetConfig);

    expect(result.is_compatible).toBe(false);
    expect(result.warnings[0]).toContain(
      "System lacks required PCIe x16 expansion slots",
    );
  });
  test("should warn or reject if system generation is significantly outdated", () => {
    const oldSystem: SystemPcieSpec = {
      pcie_x16_slots_count: 1,
      supported_generation: "PCIe 3.0",
    };

    const targetConfig: TargetPcieConfiguration = {
      minimum_form_factor: "x16",
      required_generation: "PCIe 5.0",
    };

    const result = validatePcieConstraints(oldSystem, targetConfig);

    expect(result.is_compatible).toBe(false);
    expect(result.warnings[0]).toContain("is older than component requirement");
  });
});
