import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";

interface DiagnosticFormProps {
  onResult: (result: any) => void;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ onResult }) => {
  const [step, setStep] = useState<1 | 2>(1);

  const [workstations, setWorkstations] = useState<any[]>([]);
  const [workstationId, setWorkstationId] = useState("");
  const [profileName, setProfileName] = useState("3D Animation");
  const [symptomKey, setSymptomKey] = useState("viewport_lag_low_fps");

  // Hardware actual del usuario normalizado (Generación 2021-2025)
  const [cpu, setCpu] = useState("Intel Core i7-13700K / 14700K");
  const [ramGb, setRamGb] = useState("32");
  const [gpuModel, setGpuModel] = useState("NVIDIA RTX 4070 (12GB)");
  const [storageType, setStorageType] = useState("M.2 NVMe Gen 4 SSD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/upgradeHardware")
      .then((res) => {
        const data = res.data.data || res.data;
        setWorkstations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading workstation:", err);
        setError("Could not load hardware workstations from the server");
      });
  }, []);

  const getGroupedWorkstations = () => {
    const sortByName = (a: any, b: any) => {
      const nameA =
        `${a.system_info?.brand || ""} ${a.system_info?.model || ""}`.toLowerCase();
      const nameB =
        `${b.system_info?.brand || ""} ${b.system_info?.model || ""}`.toLowerCase();
      return nameA.localeCompare(nameB);
    };

    const desktops = workstations
      .filter((ws) => {
        const word = (ws.system_info?.form_factor || "").toLowerCase();
        const isLaptop =
          word.includes("laptop") ||
          word.includes("notebook") ||
          word.includes("portable");
        return !isLaptop;
      })
      .sort(sortByName);

    const laptops = workstations
      .filter((ws) => {
        const word = (ws.system_info?.form_factor || "").toLowerCase();
        return (
          word.includes("laptop") ||
          word.includes("notebook") ||
          word.includes("portable")
        );
      })
      .sort(sortByName);
    return { desktops, laptops };
  };

  const { desktops, laptops } = getGroupedWorkstations();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workstationId || !profileName) {
      setError("Please select both a workstation and a professional profile.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmitDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomKey) {
      setError("Please select a primary symptom");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/diagnostics/diagnose", {
        workstationId,
        profileName,
        symptomKey,
        cpu,
        ramGb: Number(ramGb),
        gpuModel,
        storageType,
      });
      onResult(response.data.data);
    } catch (err: any) {
      console.error("Diagnostic error:", err);
      setError(
        err.response?.data?.message ||
          "Error executing hardware diagnostic on the server.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-brand-container p-6 md:p-8 rounded-2xl shadow-xl border border-brand-secondary/20 w-full max-w-xl mx-auto transition-all">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-secondary/20">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-bg-base">
            {step === 1
              ? "Step 1: Profile & Hardware Configuration"
              : "Step 2: Performance Symptom"}
          </h2>
          <p className="text-slate-600 text-xs md:text-sm mt-1">
            {step === 1
              ? "Select your professional workload, system, and 2021-2025 component configuration."
              : "Identify the primary bottleneck or behavior experienced"}
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-brand-secondary/10 text-brand-bg-base rounded-full">
          Step {step} of 2
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Professional Profile */}
          <div>
            <label className="block text-sm font-semibold text-brand-bg-base mb-1.5">
              Professional Profile
            </label>
            <select
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full p-3 rounded-lg border border-brand-secondary/40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-button transition-all"
              required
            >
              <option value="3D Animation">3D Animation</option>
              <option value="Video Editor">Video Editor</option>
              <option value="Motion Graphics Artist">
                Motion Graphics Artist
              </option>
              <option value="Streamer">Streamer</option>
            </select>
          </div>

          {/* Workstation System */}
          <div>
            <label className="block text-sm font-semibold text-brand-bg-base mb-1.5">
              Workstation System (Chassis / Motherboard Base)
            </label>
            <select
              value={workstationId}
              onChange={(e) => setWorkstationId(e.target.value)}
              className="w-full p-3 rounded-lg border border-brand-secondary/40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-button transition-all"
              required
            >
              <option value="">-- Select a workstation --</option>
              {desktops.length > 0 && (
                <optgroup label="Desktops (Alphabetical)">
                  {desktops.map((ws) => (
                    <option key={ws._id} value={ws._id}>
                      {ws.system_info?.brand} {ws.system_info?.model} (
                      {ws.system_info?.form_factor})
                    </option>
                  ))}
                </optgroup>
              )}
              {laptops.length > 0 && (
                <optgroup label="Laptops / Portables (Alphabetical)">
                  {laptops.map((ws) => (
                    <option key={ws._id} value={ws._id}>
                      {ws.system_info?.brand} {ws.system_info?.model} (
                      {ws.system_info?.form_factor})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Grid ampliado (2021-2025 Component Catalog) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* CPU Actual (2021-2025) */}
            <div>
              <label className="block text-xs font-semibold text-brand-bg-base mb-1">
                Current CPU (2021-2025 Gen)
              </label>
              <select
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-brand-secondary/40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-button"
                required
              >
                <optgroup label="Intel Core (12th - 14th Gen / Ultra)">
                  <option value="Intel Core i5-12600K / 13600K">
                    Intel Core i5 (12th/13th Gen)
                  </option>
                  <option value="Intel Core i7-13700K / 14700K">
                    Intel Core i7 (13th/14th Gen)
                  </option>
                  <option value="Intel Core i9-13900K / 14900K">
                    Intel Core i9 (13th/14th Gen)
                  </option>
                  <option value="Intel Core Ultra 7 / 9">
                    Intel Core Ultra 7 / 9 (2024-2025)
                  </option>
                </optgroup>
                <optgroup label="AMD Ryzen (Series 5000 - 9000)">
                  <option value="AMD Ryzen 7 5800X / 7700X">
                    AMD Ryzen 7 (5800X / 7700X)
                  </option>
                  <option value="AMD Ryzen 9 5950X / 7950X">
                    AMD Ryzen 9 (5950X / 7950X)
                  </option>
                  <option value="AMD Ryzen 9 9950X">
                    AMD Ryzen 9 9950X (2024-2025)
                  </option>
                </optgroup>
                <optgroup label="Apple Silicon">
                  <option value="Apple M2 Pro / Max / Ultra">
                    Apple M2 Pro / Max / Ultra
                  </option>
                  <option value="Apple M3 Pro / Max">Apple M3 Pro / Max</option>
                  <option value="Apple M4 Pro / Max">
                    Apple M4 Pro / Max (2024-2025)
                  </option>
                </optgroup>
              </select>
            </div>

            {/* RAM Actual (GB) (2021-2025 Capacities) */}
            <div>
              <label className="block text-xs font-semibold text-brand-bg-base mb-1">
                Current RAM (Capacity & Tech)
              </label>
              <select
                value={ramGb}
                onChange={(e) => setRamGb(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-brand-secondary/40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-button"
                required
              >
                <option value="16">16 GB DDR4 / DDR5 (Entry)</option>
                <option value="32">32 GB DDR4 / DDR5 (Standard)</option>
                <option value="64">
                  64 GB DDR5 (Professional Recommended)
                </option>
                <option value="128">
                  128 GB DDR5 (High-End / Workstation)
                </option>
                <option value="192">192 GB Unified / DDR5 (Max Studio)</option>
              </select>
            </div>

            {/* GPU Actual (2021-2025 Series) */}
            <div>
              <label className="block text-xs font-semibold text-brand-bg-base mb-1">
                Current GPU Model (VRAM)
              </label>
              <select
                value={gpuModel}
                onChange={(e) => setGpuModel(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-brand-secondary/40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-button"
                required
              >
                <optgroup label="NVIDIA RTX 30 Series (2021)">
                  <option value="NVIDIA RTX 3060 / 3070 (8-12GB)">
                    NVIDIA RTX 3060 / 3070 (8-12GB)
                  </option>
                  <option value="NVIDIA RTX 3080 / 3090 (10-24GB)">
                    NVIDIA RTX 3080 / 3090 (10-24GB)
                  </option>
                </optgroup>
                <optgroup label="NVIDIA RTX 40 Series (2022-2024)">
                  <option value="NVIDIA RTX 4060 (8GB)">
                    NVIDIA RTX 4060 (8GB)
                  </option>
                  <option value="NVIDIA RTX 4070 (12GB)">
                    NVIDIA RTX 4070 (12GB)
                  </option>
                  <option value="NVIDIA RTX 4080 (16GB)">
                    NVIDIA RTX 4080 (16GB)
                  </option>
                  <option value="NVIDIA RTX 4090 (24GB)">
                    NVIDIA RTX 4090 (24GB)
                  </option>
                </optgroup>
                <optgroup label="NVIDIA RTX Workstation / Ada Generation">
                  <option value="NVIDIA RTX A4000 / A5000 (16-24GB)">
                    NVIDIA RTX A4000 / A5000 (16-24GB)
                  </option>
                  <option value="NVIDIA RTX 5000 / 6000 Ada (16-48GB)">
                    NVIDIA RTX 5000 / 6000 Ada (16-48GB)
                  </option>
                </optgroup>
              </select>
            </div>

            {/* Almacenamiento Actual (2021-2025 Standards) */}
            <div>
              <label className="block text-xs font-semibold text-brand-bg-base mb-1">
                Storage Type & Interface
              </label>
              <select
                value={storageType}
                onChange={(e) => setStorageType(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-brand-secondary/40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-button"
                required
              >
                <option value="SATA SSD">
                  SATA III SSD (Legacy / Secondary)
                </option>
                <option value="M.2 NVMe Gen 3 SSD">
                  M.2 NVMe Gen 3 SSD (~3500 MB/s)
                </option>
                <option value="M.2 NVMe Gen 4 SSD">
                  M.2 NVMe Gen 4 SSD (~7000 MB/s)
                </option>
                <option value="M.2 NVMe Gen 5 SSD">
                  M.2 NVMe Gen 5 SSD (~14000 MB/s)
                </option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full mt-4 bg-brand-button hover:bg-brand-button-hover text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center space-x-2"
          >
            <span>Next</span>
          </button>
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-semibold text-brand-bg-base mb-1.5">
              Primary Symptom
            </label>
            <select
              value={symptomKey}
              onChange={(e) => setSymptomKey(e.target.value)}
              className="w-full p-3 rounded-lg border border-brand-secondary/40 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-button transition-all"
              required
            >
              <option value="viewport_lag_low_fps">
                viewport lag / low fps
              </option>
              <option value="gpu_render_crash">gpu render crash</option>
              <option value="slow_large_project_loading">
                slow large project loading
              </option>
              <option value="cpu_thermal_throttling">
                cpu thermal throttling
              </option>
            </select>
          </div>

          <div className="flex space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmitDiagnostic}
              disabled={loading}
              className="w-2/3 bg-brand-button hover:bg-brand-button-hover text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Analyzing compatibility...</span>
              ) : (
                <span>Run Diagnostic</span>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
