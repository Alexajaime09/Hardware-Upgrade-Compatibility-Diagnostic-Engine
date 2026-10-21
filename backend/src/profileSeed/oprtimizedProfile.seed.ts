import { OptimizedProfileModel } from "../models/optimizedProfile.model";

export const seedOptimizedProfiles = async () => {
  const profilesFor3DAnimation = [
    {
      profile: "3D Animation",
      symptom_key: "viewport_lag_low_fps",
      component_category: "Memory and GPU",
      target_required_ram_gb: 64,
      cpu_tdp_w: 125,
      gpu_tdp_w: 300,
      target_gpu_length_mm: 300,
      target_gpu_slots: 3,
      minimum_form_factor: "Tower",
      required_generation: "PCIe 4.0",
    },
    {
      profile: "3D Animation",
      symptom_key: "gpu_render_crash",
      component_category: "Power Supply and GPU",
      target_required_ram_gb: 32,
      cpu_tdp_w: 125,
      gpu_tdp_w: 350,
      target_gpu_length_mm: 320,
      target_gpu_slots: 3,
      minimum_form_factor: "Tower",
      required_generation: "PCIe 4.0",
    },
    {
      profile: "3D Animation",
      symptom_key: "slow_large_project_loading",
      component_category: "Storage and Memory",
      target_required_ram_gb: 128,
      cpu_tdp_w: 125,
      gpu_tdp_w: 300,
      target_gpu_length_mm: 300,
      target_gpu_slots: 3,
      minimum_form_factor: "Tower",
      required_generation: "PCIe 5.0",
    },
    {
      profile: "3D Animation",
      symptom_key: "cpu_thermal_throttling",
      component_category: "Cooling and CPU",
      target_required_ram_gb: 64,
      cpu_tdp_w: 250,
      gpu_tdp_w: 250,
      target_gpu_length_mm: 280,
      target_gpu_slots: 2,
      minimum_form_factor: "Tower",
      required_generation: "PCIe 4.0",
    },
  ];
  await OptimizedProfileModel.deleteMany({ profile: "3D Animation" });
  await OptimizedProfileModel.insertMany(profilesFor3DAnimation);
  console.log("Optimized profiles for 3D Animation seeded succesfully");
};
