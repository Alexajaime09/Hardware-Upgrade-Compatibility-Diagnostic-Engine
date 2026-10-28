export interface PhysicalValidationInput {
  max_gpu_slots: number;
  max_gpu_length_mm: number;
  gpu_slots: number;
  gpu_length_mm: number;
  user_gpu_vram_gb?: number;
  target_min_vram_gb?: number;
  target_gpu_model_name?: string;
}

export interface PhysicalRuleResult {
  is_compatible: boolean;
  warnings: string[];
  gpu_upgrade_suggested?: string;
}

export function validatePhysicalConstrains(
  input: PhysicalValidationInput,
): PhysicalRuleResult {
  const warnings: string[] = [];

  if (input.gpu_length_mm > input.max_gpu_length_mm) {
    warnings.push(
      `The GPU length (${input.gpu_length_mm})mm exceeds the maximum allowed chassis clearance (${input.max_gpu_length_mm}mm). `,
    );
  }

  if (input.gpu_slots > input.max_gpu_slots) {
    warnings.push(
      `The GPU requires ${input.gpu_slots} slots width, but the chassis only supports up to ${input.max_gpu_slots} slots `,
    );
  }

  let gpuUpgradeSuggested: string | undefined = undefined;
  if (
    input.user_gpu_vram_gb !== undefined &&
    input.target_min_vram_gb !== undefined &&
    input.user_gpu_vram_gb < input.target_min_vram_gb
  ) {
    warnings.push(
      `Current GPU VRAM (${input.user_gpu_vram_gb} GB) is insufficient for this profile. Minimum recommended is ${input.target_min_vram_gb} GB VRAM.`,
    );
    gpuUpgradeSuggested =
      input.target_gpu_model_name ||
      `GPU with at least ${input.target_min_vram_gb} GB VRAM`;
  }

  return {
    is_compatible:
      warnings.length === 0 ||
      (warnings.length === 1 &&
        gpuUpgradeSuggested !== undefined &&
        input.gpu_length_mm <= input.max_gpu_length_mm &&
        input.gpu_slots <= input.max_gpu_slots),
    warnings,
    gpu_upgrade_suggested: gpuUpgradeSuggested,
  };
}
