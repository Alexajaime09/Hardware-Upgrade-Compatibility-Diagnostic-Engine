import {
  validateRamConstraints,
  SystemRamSpec,
  TargetRamConfiguration,
} from "../engine/rules/ram.rule";

describe("RAM Diagnostic & Recommendation Filter Rule (ram.rule)", () => {
  const baseSystemSpec: SystemRamSpec = {
    ram_slots_count: 4,
    max_ram_gb: 128,
    supported_technologies: ["UDIMM DDR5 non-ECC", "UDIMM DDR5 ECC"],
  };

  test("should approve a valid homogeneous configuration (2 x 32GB ECC)", () => {
    const targetConfig: TargetRamConfiguration = {
      module_count: 2,
      capacity_per_module_gb: 32,
      technology: "UDIMM DDR5 ECC",
      is_ecc: true,
    };

    const result = validateRamConstraints(baseSystemSpec, targetConfig);

    expect(result.is_compatible).toBe(true);
    expect(result.total_capacity_gb).toBe(64);
    expect(result.warnings).toHaveLength(0);
  });

  test("should reject configuration exceeding physical slots count", () => {
    const laptopSystemSpec: SystemRamSpec = {
      ram_slots_count: 2,
      max_ram_gb: 64,
      supported_technologies: ["SODIMM DDR5 non-ECC"],
    };

    const targetConfig: TargetRamConfiguration = {
      module_count: 4,
      capacity_per_module_gb: 16,
      technology: "SODIMM DDR5 non-ECC",
      is_ecc: false,
    };

    const result = validateRamConstraints(laptopSystemSpec, targetConfig);

    expect(result.is_compatible).toBe(false);
    expect(result.warnings).toContain(
      "Target module count (4) exceeds available slots (2).",
    );
  });

  test("should reject configuration exceeding motherboard maximum RAM capacity", () => {
    const targetConfig: TargetRamConfiguration = {
      module_count: 4,
      capacity_per_module_gb: 48,
      technology: "UDIMM DDR5 non-ECC",
      is_ecc: false,
    };

    const result = validateRamConstraints(baseSystemSpec, targetConfig);

    expect(result.is_compatible).toBe(false);
    expect(result.total_capacity_gb).toBe(192);
    expect(result.warnings).toContain(
      "Total memory capacity (192 GB) exceeds maximum system limit (128 GB).",
    );
  });

  test("should reject unsupported RAM technology", () => {
    const targetConfig: TargetRamConfiguration = {
      module_count: 2,
      capacity_per_module_gb: 32,
      technology: "CUDIMM DDR5 non-ECC",
      is_ecc: false,
    };

    const result = validateRamConstraints(baseSystemSpec, targetConfig);

    expect(result.is_compatible).toBe(false);
    expect(result.warnings).toContain(
      "Memory technology 'CUDIMM DDR5 non-ECC' is not supported by this system.",
    );
  });

  test("should enforce special business rule: 8GB modules cannot use ECC technology", () => {
    const targetConfig: TargetRamConfiguration = {
      module_count: 2,
      capacity_per_module_gb: 8,
      technology: "UDIMM DDR5 ECC",
      is_ecc: true,
    };

    const result = validateRamConstraints(baseSystemSpec, targetConfig);

    expect(result.is_compatible).toBe(false);
    expect(result.warnings).toContain(
      "8 GB modules with ECC technology are not supported by system architecture.",
    );
  });
});
