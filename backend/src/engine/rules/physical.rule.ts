import { warn } from "node:console";

export interface PhysicalValidationInput {
  max_gpu_slots: number;
  max_gpu_length_mm: number;
  gpu_slots: number;
  gpu_length_mm: number;
}

export interface PhysicalRuleResult {
  is_compatible: boolean;
  warnings: string[];
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

  return {
    is_compatible: warnings.length === 0,
    warnings,
  };
}
