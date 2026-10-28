import { Schema, model, Document } from "mongoose";

export interface IOptimizedProfile extends Document {
  profile: string;
  symptom_key: string;
  component_category: string;
  target_required_ram_gb: number;
  cpu_tdp_w: number;
  gpu_tdp_w: number;
  target_gpu_length_mm: number;
  target_gpu_slots: number;
  target_min_vram_gb?: number;
  target_gpu_model_name?: string;
  minimum_form_factor: string;
  required_generation: string;
}

const OptimizedProfileSchema = new Schema<IOptimizedProfile>({
  profile: { type: String, required: true, index: true },
  symptom_key: { type: String, required: true, index: true },
  component_category: { type: String, required: true },
  target_required_ram_gb: { type: Number, required: true },
  cpu_tdp_w: { type: Number, required: true },
  gpu_tdp_w: { type: Number, required: true },
  target_gpu_length_mm: { type: Number, required: true },
  target_gpu_slots: { type: Number, required: true },
  target_min_vram_gb: { type: Number, required: false },
  target_gpu_model_name: { type: String, required: false },
  minimum_form_factor: { type: String, required: true },
  required_generation: { type: String, required: true },
});

export const OptimizedProfileModel = model<IOptimizedProfile>(
  "OptimizedProfile",
  OptimizedProfileSchema,
);
