import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkstationSystem extends Document {
  system_info: {
    system_id: string;
    brand: string;
    model: string;
    year: number;
    form_factor: string;
  };
  physical_constraints: {
    max_gpu_slots: number;
    max_gpu_length_mm: number;
    max_cpu_cooler_height_mm: number;
  };
  power_supply: {
    is_proprietary: boolean;
    available_wattages_w: number[];
  };
  motherboard_expansion: {
    socket: string;
    chipset: string;
    ram_slots_count: number;
    max_ram_gb: number;
    supported_ram_technologies: string[];
    pcie_slots: Array<{
      slot_id: number;
      gen: number;
      lanes: number;
      size: string;
    }>;
    m2_nvme_slots: Array<{
      slot_id: number;
      gen: number;
      lanes: number;
      max_size: string;
    }>;
  };
}
const WorkstationSchema = new Schema<IWorkstationSystem>(
  {
    system_info: {
      system_id: { type: String, required: true, unique: true },
      brand: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      form_factor: { type: String, required: true },
    },
    physical_constraints: {
      max_gpu_slots: { type: Number, required: true },
      max_gpu_length_mm: { type: Number, required: true },
      max_cpu_cooler_height_mm: { type: Number, required: true },
    },
    power_supply: {
      is_proprietary: { type: Boolean, default: false },
      available_wattages_w: [{ type: Number }],
    },
    motherboard_expansion: {
      socket: { type: String, required: true },
      chipset: { type: String, required: true },
      ram_slots_count: { type: Number, required: true },
      max_ram_gb: { type: Number, required: true },
      supported_ram_technologies: [{ type: String }],
      pcie_slots: [
        {
          slot_id: Number,
          gen: Number,
          lanes: Number,
          size: String,
        },
      ],
      m2_nvme_slots: [
        {
          slot_id: Number,
          gen: Number,
          lanes: Number,
          max_size: String,
        },
      ],
    },
  },
  { timestamps: true },
);

export const WorkstationModel: Model<IWorkstationSystem> =
  mongoose.model<IWorkstationSystem>("Workstation", WorkstationSchema);
