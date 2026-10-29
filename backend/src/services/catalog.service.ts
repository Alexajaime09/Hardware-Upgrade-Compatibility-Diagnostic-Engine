import fs from "fs";
import path from "path";

export interface CpuComponent {
  cpu_id: string;
  brand: string;
  model: string;
  generation: string;
  cores: number;
  threads: number;
  clock_speed: {
    base_ghz: number;
    turbo_ghz: number;
  };
  cache_mb: number;
  base_tdp_watts: number;
  vpro_support: boolean;
  integrated_graphics?: {
    model: string;
    supports_quicksync: boolean;
  };
}

export interface GpuComponent {
  gpu_id: string;
  brand: string;
  series: string;
  model: string;
  vram_gb: number;
  vram_type: number;
  tdp_watts: number;
  slot_width: number;
  length_mm: number;
  power_connector: string;
  video_outputs?: {
    ports: Array<{ type: string; version: string; count: number }>;
  };
  requires_adapter?: {
    minidp_to_dp: boolean;
  };
}

export interface RamComponent {
  ram_id: string;
  form_factor: string;
  technology: string;
  capacity_gb: number;
  speed_mts: number;
  ecc_support: boolean;
  voltage_v: number;
  pin_count: number;
}

export interface StorageDriveComponent {
  drive_id: string;
  type: string;
  form_factor: string;
  interface: string;
  capacity_gb: number;
  read_speed_mbps?: number;
  write_speed_mbps?: number;
  self_encrypting?: boolean;
  class_category?: string;
  rpm?: number;
  grade?: string;
}

let cacheCpus: CpuComponent[] | null = null;
let cacheGpus: GpuComponent[] | null = null;
let cacheRams: RamComponent[] | null = null;
let cacheStorage: StorageDriveComponent[] | null = null;

function componentsJson<T>(relativePath: string): T[] {
  try {
    const filePath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as T[];
    }
  } catch (error) {
    console.error(`Error to charge catalog from ${relativePath}`, error);
  }
  return [];
}

export function findCpuSpec(cpuInfo?: string): CpuComponent | null {
  if (!cpuInfo) return null;
  if (!cacheCpus) {
    cacheCpus = componentsJson<CpuComponent>("data/components/cpus.json ");
  }
  const key = cpuInfo.toLowerCase().trim();

  return (
    cacheCpus.find(
      (cpu) =>
        cpu.cpu_id.toLowerCase() === key ||
        cpu.model.toLowerCase() === key ||
        key.includes(cpu.model.toLowerCase()) ||
        cpu.model.toLowerCase().includes(key),
    ) || null
  );
}

export function findGpuSpecs(gpuInfo: string): GpuComponent | null {
  if (!gpuInfo) return null;
  if (!cacheGpus) {
    cacheGpus = componentsJson<GpuComponent>("data/components/gpus.json");
  }
  const key = gpuInfo.toLowerCase().trim();

  return (
    cacheGpus.find(
      (gpu) =>
        gpu.gpu_id.toLowerCase() === key ||
        gpu.model.toLowerCase() === key ||
        key.includes(gpu.model.toLowerCase()) ||
        gpu.model.toLowerCase().includes(key),
    ) || null
  );
}

export function findRamSpecs(ramInfo?: string): RamComponent | null {
  if (!ramInfo) return null;
  if (!cacheRams) {
    cacheRams = componentsJson<RamComponent>("data/components/rams.json");
  }
  return cacheRams.find((ram) => ram.ram_id === ramInfo) || null;
}

export function findStorageSpecs(
  driveInfo?: string,
): StorageDriveComponent | null {
  if (!driveInfo) return null;
  if (!cacheStorage) {
    cacheStorage = componentsJson<StorageDriveComponent>(
      "data/components/storage_drives.json",
    );
  }
  return cacheStorage.find((drive) => drive.drive_id === driveInfo) || null;
}
