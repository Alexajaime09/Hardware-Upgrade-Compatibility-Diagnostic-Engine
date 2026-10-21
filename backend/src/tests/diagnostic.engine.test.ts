import {
  runDiagnosticEngine,
  DiagnosticRequest,
} from "../engine/diagnostic.engine";

describe("Diagnostic Engine Orchestrator(diagnostic.engine)", () => {
  test("should return fully compatible result when all rule validations pass", () => {
    const request: DiagnosticRequest = {
      profile: "Video Editor",
      symptom: "Slow rendering and timeline lags",
      component_category: "Memory and GPU",
      physicalInput: {
        max_gpu_slots: 3,
        max_gpu_length_mm: 350,
        gpu_slots: 2,
        gpu_length_mm: 260,
      },
      powerInput: {
        psu_wattage_installed: 750,
        available_psu_upgrades: [1000],
        cpu_tdp_w: 125,
        gpu_tdp_w: 250,
      },
      pcieSystemSpec: {
        pcie_x16_slots_count: 2,
        supported_generation: "PCIe 4.0",
      },
      pcieTargetConfig: {
        minimum_form_factor: "x16",
        required_generation: "PCIe 4.0",
      },
      ramSystemSpec: {
        ram_slots_count: 4,
        max_ram_gb: 128,
        supported_technologies: ["DDR5"],
      },

      ramTargetConfig: {
        module_count: 2,
        capacity_per_module_gb: 32,
        technology: "DDR5",
        is_ecc: false,
      },
    };

    const result = runDiagnosticEngine(request);

    expect(result.is_fully_compatible).toBe(true);
    expect(result.consolidated_warnings).toHaveLength(0);
    expect(result.recommendations.requires_system_replacement).toBe(false);
    expect(result.recommendations.calculated_ram_capacity_gb).toBe(64);
  });

  test("should consolidate warnings and flag upgrade/replacement when rules fail", () => {
    const request: DiagnosticRequest = {
      profile: "3D Animation",
      symptom: "Crahes during heavy scenes and power cuts",
      component_category: "Memory and GPU",
      physicalInput: {
        max_gpu_slots: 2,
        max_gpu_length_mm: 240,
        gpu_slots: 3,
        gpu_length_mm: 300,
      },
      powerInput: {
        psu_wattage_installed: 400,
        available_psu_upgrades: [750],
        cpu_tdp_w: 200,
        gpu_tdp_w: 350,
      },
      pcieSystemSpec: {
        pcie_x16_slots_count: 1,
        supported_generation: "PCIe 3.0",
      },
      pcieTargetConfig: {
        minimum_form_factor: "x16",
        required_generation: "Pcie 5.0",
      },
      ramSystemSpec: {
        ram_slots_count: 2,
        max_ram_gb: 32,
        supported_technologies: ["DDR4"],
      },
      ramTargetConfig: {
        module_count: 4,
        capacity_per_module_gb: 32,
        technology: "DDR4",
        is_ecc: false,
      },
    };

    const result = runDiagnosticEngine(request);

    expect(result.is_fully_compatible).toBe(false);
    expect(result.consolidated_warnings.length).toBeGreaterThan(0);
    expect(result.recommendations.requires_system_replacement).toBe(true);
    expect(result.recommendations.required_psu_upgrade_w).toBe(750);
  });
});
