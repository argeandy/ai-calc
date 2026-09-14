/**
 * GPU and Hardware Accelerator Catalog
 * Specs: VRAM, Memory Bandwidth, Tensor TFLOPS, TDP, Interconnect, Capex, and Cloud Rates
 */
export const GPU_CATALOG = [
  // --- Datacenter Frontier ---
  {
    id: 'rubin-nvl8',
    name: 'NVIDIA Rubin NVL8 (288GB HBM4)',
    vendor: 'NVIDIA',
    tier: 'Frontier Datacenter (Vera Rubin)',
    serverChassisId: 'dell-powerrack-rubin',
    vram: 288, // GB
    vramType: 'HBM4',
    bandwidth: 14000, // GB/s (14 TB/s)
    fp16Tflops: 4500,
    fp8Tflops: 9000,
    tdp: 1200, // Watts (Direct Liquid Cooled)
    interconnect: 'NVLink 6 (3600 GB/s bidirectional)',
    interconnectBandwidth: 3600,
    maxPerNode: 8,
    capexPrice: 58000,
    cloudHourlyOnDemand: 7.50,
    cloudHourly1YrReserved: 4.90,
    description: 'NVIDIA Rubin Flagship mit 288GB HBM4 und Vera CPU im Dell PowerRack. Konzipiert für Agentic AI und Reasoning im Terabyte-Maßstab.',
    badges: ['Next-Gen Rubin', '288GB HBM4', '14 TB/s', 'Vera CPU']
  },
  {
    id: 'b200-dlc',
    name: 'NVIDIA B200 DLC (192GB Liquid)',
    vendor: 'NVIDIA',
    tier: 'Frontier Datacenter',
    serverChassisId: 'dell-m9822',
    vram: 192,
    vramType: 'HBM3e',
    bandwidth: 8000,
    fp16Tflops: 2250,
    fp8Tflops: 4500,
    tdp: 1000,
    interconnect: 'NVLink 5 (1800 GB/s bidirectional)',
    interconnectBandwidth: 1800,
    maxPerNode: 4,
    capexPrice: 44000,
    cloudHourlyOnDemand: 5.60,
    cloudHourly1YrReserved: 3.70,
    description: '100% Direct Liquid-Cooled B200 im 2U Dell PowerEdge M9822 mit NVIDIA Vera CPUs für maximale Packungsdichte und Kühleffizienz.',
    badges: ['100% DLC Liquid', '2U PowerEdge M9822', 'Vera CPU']
  },
  {
    id: 'b200',
    name: 'NVIDIA B200 SXM',
    vendor: 'NVIDIA',
    tier: 'Frontier Datacenter',
    serverChassisId: 'dell-xe9680',
    vram: 192, // GB
    vramType: 'HBM3e',
    bandwidth: 8000, // GB/s (8.0 TB/s)
    fp16Tflops: 2250, // Dense/Sparse Tensor Core
    fp8Tflops: 4500,
    tdp: 1000, // Watts
    interconnect: 'NVLink 5 (1800 GB/s bidirectional)',
    interconnectBandwidth: 1800,
    maxPerNode: 8,
    capexPrice: 42000, // EUR/USD estimated per GPU
    cloudHourlyOnDemand: 5.50,
    cloudHourly1YrReserved: 3.60,
    description: 'Blackwell architecture flagship. 192GB HBM3e and unprecedented 8 TB/s memory bandwidth for trillion-parameter models.',
    badges: ['Frontier', '8 TB/s Bandwidth', 'Blackwell']
  },
  {
    id: 'h200-sxm',
    name: 'NVIDIA H200 SXM (141GB)',
    vendor: 'NVIDIA',
    tier: 'Enterprise Datacenter',
    serverChassisId: 'dell-xe9680',
    vram: 141,
    vramType: 'HBM3e',
    bandwidth: 4800, // 4.8 TB/s
    fp16Tflops: 989,
    fp8Tflops: 1979,
    tdp: 700,
    interconnect: 'NVLink 4 (900 GB/s bidirectional)',
    interconnectBandwidth: 900,
    maxPerNode: 8,
    capexPrice: 36000,
    cloudHourlyOnDemand: 4.20,
    cloudHourly1YrReserved: 2.80,
    description: 'Hopper refresh with 141GB ultra-fast HBM3e. The ultimate workhorse for high-concurrency LLM inference.',
    badges: ['Highest Concurrency', '4.8 TB/s Bandwidth', 'Hopper']
  },
  {
    id: 'h100-sxm',
    name: 'NVIDIA H100 SXM (80GB)',
    vendor: 'NVIDIA',
    tier: 'Enterprise Datacenter',
    serverChassisId: 'dell-xe9680',
    vram: 80,
    vramType: 'HBM3',
    bandwidth: 3350, // 3.35 TB/s
    fp16Tflops: 989,
    fp8Tflops: 1979,
    tdp: 700,
    interconnect: 'NVLink 4 (900 GB/s bidirectional)',
    interconnectBandwidth: 900,
    maxPerNode: 8,
    capexPrice: 30000,
    cloudHourlyOnDemand: 3.30,
    cloudHourly1YrReserved: 2.10,
    description: 'Standard enterprise LLM accelerator. Industry benchmark for FP8 serving with Transformer Engine.',
    badges: ['Standard Enterprise', 'Transformer Engine']
  },
  {
    id: 'a100-sxm-80gb',
    name: 'NVIDIA A100 SXM (80GB)',
    vendor: 'NVIDIA',
    tier: 'Enterprise Datacenter (Ampere)',
    serverChassisId: 'dell-xe9680',
    vram: 80,
    vramType: 'HBM2e',
    bandwidth: 2039, // 2.0 TB/s
    fp16Tflops: 312,
    fp8Tflops: 312, // Native FP8 not supported, emulated FP16
    tdp: 400,
    interconnect: 'NVLink 3 (600 GB/s bidirectional)',
    interconnectBandwidth: 600,
    maxPerNode: 8,
    capexPrice: 15000,
    cloudHourlyOnDemand: 1.80,
    cloudHourly1YrReserved: 1.15,
    description: 'Cost-effective high-memory GPU. Reliable for FP16/INT8 inference across all clouds.',
    badges: ['Budget High-Memory', 'Ampere']
  },
  {
    id: 'mi300x',
    name: 'AMD Instinct MI300X (192GB)',
    vendor: 'AMD',
    tier: 'Enterprise Datacenter',
    serverChassisId: 'supermicro-8u-hgx',
    vram: 192,
    vramType: 'HBM3',
    bandwidth: 5300, // 5.3 TB/s
    fp16Tflops: 1300,
    fp8Tflops: 2600,
    tdp: 750,
    interconnect: 'Infinity Fabric (896 GB/s bidirectional)',
    interconnectBandwidth: 896,
    maxPerNode: 8,
    capexPrice: 22000,
    cloudHourlyOnDemand: 2.80,
    cloudHourly1YrReserved: 1.75,
    description: '192GB HBM3 powerhouse from AMD with ROCm / vLLM native support. Exceptional memory capacity per dollar.',
    badges: ['192GB VRAM', '5.3 TB/s', 'AMD ROCm']
  },

  // --- Enterprise Inference & Workstation ---
  {
    id: 'rtx-pro-server',
    name: 'NVIDIA RTX PRO Server (48GB)',
    vendor: 'NVIDIA',
    tier: 'Enterprise Agentic Server',
    serverChassisId: 'dell-r9822',
    vram: 48,
    vramType: 'GDDR7 ECC',
    bandwidth: 1440, // GB/s
    fp16Tflops: 550,
    fp8Tflops: 1100,
    tdp: 350,
    interconnect: 'PCIe Gen5 (64 GB/s)',
    interconnectBandwidth: 64,
    maxPerNode: 4,
    capexPrice: 9200,
    cloudHourlyOnDemand: 1.40,
    cloudHourly1YrReserved: 0.90,
    description: 'Enterprise RTX PRO Beschleuniger im luftgekühlten Dell PowerEdge R9822 3U Server mit NVIDIA Vera CPUs für Agentic Sandboxes und RAG.',
    badges: ['RTX PRO', 'Vera CPU 3U', 'Agentic Sandbox']
  },
  {
    id: 'l40s',
    name: 'NVIDIA L40S (48GB)',
    vendor: 'NVIDIA',
    tier: 'Enterprise Scale-Out Inference',
    serverChassisId: 'dell-r760xa',
    vram: 48,
    vramType: 'GDDR6 ECC',
    bandwidth: 864, // GB/s
    fp16Tflops: 366,
    fp8Tflops: 733,
    tdp: 350,
    interconnect: 'PCIe Gen4/5 (64 GB/s)',
    interconnectBandwidth: 64,
    maxPerNode: 4,
    capexPrice: 7500,
    cloudHourlyOnDemand: 1.10,
    cloudHourly1YrReserved: 0.70,
    description: 'Optimal for PCIe-based enterprise inference servers without requiring NVLink cages. Strong FP8 compute.',
    badges: ['PCIe Friendly', 'FP8 Inference', 'Cost-Effective Server']
  },
  {
    id: 'l4',
    name: 'NVIDIA L4 (24GB)',
    vendor: 'NVIDIA',
    tier: 'Compact Inference',
    serverChassisId: 'dell-r760xa',
    vram: 24,
    vramType: 'GDDR6',
    bandwidth: 300, // GB/s
    fp16Tflops: 120,
    fp8Tflops: 242,
    tdp: 72, // Ultra low power 72W
    interconnect: 'PCIe Gen4 (32 GB/s)',
    interconnectBandwidth: 32,
    maxPerNode: 4,
    capexPrice: 2600,
    cloudHourlyOnDemand: 0.45,
    cloudHourly1YrReserved: 0.28,
    description: 'Low-power (72W) 24GB accelerator for small models (7B/8B) and high-density microservices.',
    badges: ['72W Low Power', 'Compact Single-Slot']
  },
  {
    id: 'rtx-6000-ada',
    name: 'NVIDIA RTX 6000 Ada (48GB)',
    vendor: 'NVIDIA',
    tier: 'Professional Workstation / Server',
    serverChassisId: 'dell-r760xa',
    vram: 48,
    vramType: 'GDDR6 ECC',
    bandwidth: 960, // GB/s
    fp16Tflops: 364,
    fp8Tflops: 728,
    tdp: 300,
    interconnect: 'PCIe Gen4 (64 GB/s)',
    interconnectBandwidth: 64,
    maxPerNode: 4,
    capexPrice: 8500,
    cloudHourlyOnDemand: 1.25,
    cloudHourly1YrReserved: 0.85,
    description: 'Workstation powerhouse with 48GB ECC VRAM. Ideal for on-prem prototyping and departmental servers.',
    badges: ['48GB ECC', 'Quiet / Workstation', 'Ada Lovelace']
  },

  // --- High-End Consumer / Local Workstation ---
  {
    id: 'rtx-5090',
    name: 'NVIDIA RTX 5090 (32GB)',
    vendor: 'NVIDIA',
    tier: 'Consumer Flagship',
    serverChassisId: 'dell-precision-7960',
    vram: 32,
    vramType: 'GDDR7',
    bandwidth: 1792, // GB/s GDDR7
    fp16Tflops: 420,
    fp8Tflops: 840,
    tdp: 600,
    interconnect: 'PCIe Gen5 (64 GB/s)',
    interconnectBandwidth: 64,
    maxPerNode: 2,
    capexPrice: 2400,
    cloudHourlyOnDemand: 0.70,
    cloudHourly1YrReserved: 0.45,
    description: 'Blackwell consumer flagship with 32GB GDDR7 and 1.8 TB/s bandwidth. Supreme token generation for local setups.',
    badges: ['GDDR7 1.8 TB/s', '32GB VRAM', 'High DIY Performance']
  },
  {
    id: 'rtx-4090',
    name: 'NVIDIA RTX 4090 (24GB)',
    vendor: 'NVIDIA',
    tier: 'Consumer Workstation',
    serverChassisId: 'dell-precision-7960',
    vram: 24,
    vramType: 'GDDR6X',
    bandwidth: 1008, // GB/s
    fp16Tflops: 330,
    fp8Tflops: 660,
    tdp: 450,
    interconnect: 'PCIe Gen4 (32 GB/s)',
    interconnectBandwidth: 32,
    maxPerNode: 2,
    capexPrice: 1900,
    cloudHourlyOnDemand: 0.50,
    cloudHourly1YrReserved: 0.35,
    description: 'Unmatched cost-to-performance for small/medium quantized models (8B-70B Q4).',
    badges: ['DIY Favorite', '1.0 TB/s', 'Budget Champion']
  },

  // --- Apple Silicon Unified Memory ---
  {
    id: 'apple-m4-ultra-192',
    name: 'Apple Mac Studio (M4 Ultra 192GB)',
    vendor: 'Apple',
    tier: 'Unified Memory Workstation',
    serverChassisId: 'apple-silicon-studio',
    vram: 192,
    vramType: 'Unified LPDDR5X',
    bandwidth: 800, // GB/s
    fp16Tflops: 140,
    fp8Tflops: 140,
    tdp: 150,
    interconnect: 'UltraFusion (On-Die Unified Memory)',
    interconnectBandwidth: 2500,
    maxPerNode: 1,
    capexPrice: 7800,
    cloudHourlyOnDemand: 1.40,
    cloudHourly1YrReserved: 0.90,
    description: '192GB unified RAM running on Apple Silicon / MLX. Silently fits 70B FP16 or 405B Q4 on a single desk device.',
    badges: ['192GB Unified RAM', 'Silent & 150W', 'Apple MLX / Metal']
  },
  {
    id: 'apple-m2-ultra-128',
    name: 'Apple Mac Studio (M2/M3 Ultra 128GB)',
    vendor: 'Apple',
    tier: 'Unified Memory Workstation',
    serverChassisId: 'apple-silicon-studio',
    vram: 128,
    vramType: 'Unified LPDDR5',
    bandwidth: 800,
    fp16Tflops: 100,
    fp8Tflops: 100,
    tdp: 140,
    interconnect: 'UltraFusion',
    interconnectBandwidth: 2500,
    maxPerNode: 1,
    capexPrice: 5200,
    cloudHourlyOnDemand: 0.95,
    cloudHourly1YrReserved: 0.65,
    description: '128GB unified RAM for running large models locally without GPU clustering complexity.',
    badges: ['128GB Unified', 'Ultra Quiet', 'Local Dev']
  }
];

export const CLOUD_INSTANCE_MAPPINGS = {
  'rubin-nvl8': {
    aws: { name: 'p7.48xlarge (8x Rubin NVL8 Preview)', hourlyOnDemand: 180.00, hourly1Yr: 120.00 },
    azure: {
      sku: 'Standard_ND96is_Rubin_v7',
      name: 'ND96is Rubin v7 (8x Rubin NVL8)',
      gpusPerNode: 8,
      hourlyOnDemand: 58.00,
      hourly1Yr: 38.00,
      hourly3Yr: 26.00,
      specs: '8x Rubin 288GB HBM4 · Quantum-X800 InfiniBand · Vera CPU Host'
    },
    gcp: { name: 'a5-highgpu-8g (8x Rubin NVL8)', hourlyOnDemand: 60.00, hourly1Yr: 40.00 }
  },
  'b200-dlc': {
    aws: { name: 'p6e.48xlarge (Liquid B200)', hourlyOnDemand: 145.00, hourly1Yr: 95.00 },
    azure: {
      sku: 'Standard_ND96is_B200_DLC_v6',
      name: 'ND96is B200 DLC (4x/8x B200)',
      gpusPerNode: 4,
      hourlyOnDemand: 23.00,
      hourly1Yr: 15.00,
      hourly3Yr: 10.20,
      specs: 'Direct Liquid-Cooled B200 · Vera CPU Modular Architecture'
    },
    gcp: { name: 'a4-highgpu-dlc', hourlyOnDemand: 24.00, hourly1Yr: 15.80 }
  },
  'rtx-pro-server': {
    aws: { name: 'g7e.12xlarge (4x RTX PRO)', hourlyOnDemand: 10.50, hourly1Yr: 6.80 },
    azure: {
      sku: 'Standard_NG64ads_Vera_v1',
      name: 'NG64ads Vera (4x RTX PRO)',
      gpusPerNode: 4,
      hourlyOnDemand: 8.80,
      hourly1Yr: 5.60,
      hourly3Yr: 3.70,
      specs: '4x RTX PRO 48GB · Dual Vera CPUs · Spectrum-X 400G'
    },
    gcp: { name: 'g3-standard-64 (4x RTX PRO)', hourlyOnDemand: 9.00, hourly1Yr: 5.80 }
  },
  'b200': {
    aws: { name: 'p6.48xlarge (8x B200)', hourlyOnDemand: 140.00, hourly1Yr: 92.00 },
    azure: {
      sku: 'Standard_ND96is_B200_v6',
      name: 'ND96is B200 v6 (8x B200)',
      gpusPerNode: 8,
      hourlyOnDemand: 44.00,
      hourly1Yr: 28.80,
      hourly3Yr: 19.50,
      specs: '8x B200 192GB HBM3e · Quantum-X800 InfiniBand · 96 vCPUs'
    },
    gcp: { name: 'a4-highgpu-8g (8x B200)', hourlyOnDemand: 45.00, hourly1Yr: 30.00 }
  },
  'h200-sxm': {
    aws: { name: 'p5e.48xlarge (8x H200)', hourlyOnDemand: 115.00, hourly1Yr: 76.00 },
    azure: {
      sku: 'Standard_ND96is_H200_v5',
      name: 'ND96is H200 v5 (8x H200)',
      gpusPerNode: 8,
      hourlyOnDemand: 34.50,
      hourly1Yr: 22.40,
      hourly3Yr: 15.20,
      specs: '8x H200 141GB HBM3e · 3.2 Tbps Quantum-2 InfiniBand · 96 vCPUs · 1,900 GiB RAM'
    },
    gcp: { name: 'a3-megagpu-8g (8x H200)', hourlyOnDemand: 36.00, hourly1Yr: 24.00 }
  },
  'h100-sxm': {
    aws: { name: 'p5.48xlarge (8x H100)', hourlyOnDemand: 98.32, hourly1Yr: 62.92 },
    azure: {
      sku: 'Standard_ND96isr_H100_v5',
      name: 'ND96isr H100 v5 (8x H100)',
      gpusPerNode: 8,
      hourlyOnDemand: 27.20,
      hourly1Yr: 17.50,
      hourly3Yr: 11.83,
      specs: '8x H100 80GB SXM5 · 3.2 Tbps Quantum-2 InfiniBand · 96 vCPUs · 1,900 GiB RAM'
    },
    gcp: { name: 'a3-highgpu-8g (8x H100)', hourlyOnDemand: 31.00, hourly1Yr: 19.50 }
  },
  'a100-sxm-80gb': {
    aws: { name: 'p4de.24xlarge (8x A100 80GB)', hourlyOnDemand: 40.96, hourly1Yr: 26.21 },
    azure: {
      sku: 'Standard_ND96amsr_A100_v4',
      name: 'ND96amsr A100 v4 (8x A100)',
      gpusPerNode: 8,
      hourlyOnDemand: 27.20,
      hourly1Yr: 14.80,
      hourly3Yr: 9.80,
      specs: '8x A100 80GB SXM4 · 1.6 Tbps InfiniBand · 96 vCPUs · 900 GiB RAM'
    },
    gcp: { name: 'a2-ultragpu-8g (8x A100)', hourlyOnDemand: 29.00, hourly1Yr: 16.00 }
  },
  'mi300x': {
    aws: { name: 'Custom AMD Cluster', hourlyOnDemand: 24.00, hourly1Yr: 15.00 },
    azure: {
      sku: 'Standard_ND96isr_MI300X_v5',
      name: 'ND96isr MI300X v5 (8x MI300X)',
      gpusPerNode: 8,
      hourlyOnDemand: 22.40,
      hourly1Yr: 14.00,
      hourly3Yr: 9.50,
      specs: '8x MI300X 192GB HBM3 · Infinity Fabric · 96 vCPUs · 1,900 GiB RAM'
    },
    gcp: { name: 'GCP Instinct Preview', hourlyOnDemand: 24.00, hourly1Yr: 15.50 }
  },
  'l40s': {
    aws: { name: 'g6e.12xlarge (4x L40S)', hourlyOnDemand: 8.50, hourly1Yr: 5.50 },
    azure: {
      sku: 'Standard_NG48ads_V620_v1',
      name: 'NG48ads V620 (4x L40S)',
      gpusPerNode: 4,
      hourlyOnDemand: 7.20,
      hourly1Yr: 4.60,
      hourly3Yr: 3.00,
      specs: '48 vCPUs · 256 GiB RAM · 4x 48GB GDDR6'
    },
    gcp: { name: 'g2-standard-48 (4x L40S)', hourlyOnDemand: 7.50, hourly1Yr: 4.80 }
  },
  'l4': {
    aws: { name: 'g6.xlarge (1x L4) / g6.12xlarge', hourlyOnDemand: 1.25, hourly1Yr: 0.85 },
    azure: {
      sku: 'Standard_NV36adms_A10_v5',
      name: 'NV36adms A10 v5 (1x L4/A10)',
      gpusPerNode: 1,
      hourlyOnDemand: 1.45,
      hourly1Yr: 0.95,
      hourly3Yr: 0.65,
      specs: '36 vCPUs · 176 GiB RAM · PCIe Gen4'
    },
    gcp: { name: 'g2-standard-4 (1x L4)', hourlyOnDemand: 1.30, hourly1Yr: 0.88 }
  },
  'rtx-6000-ada': {
    aws: { name: 'g6e.4xlarge (1x Workstation)', hourlyOnDemand: 4.50, hourly1Yr: 2.90 },
    azure: {
      sku: 'Standard_NV72ads_A10_v5',
      name: 'NV72ads A10 v5 (2x GPU Workstation)',
      gpusPerNode: 2,
      hourlyOnDemand: 3.80,
      hourly1Yr: 2.45,
      hourly3Yr: 1.70,
      specs: '72 vCPUs · 440 GiB RAM · RTX Virtual Workstation'
    },
    gcp: { name: 'G2 Cloud Workstation', hourlyOnDemand: 4.20, hourly1Yr: 2.70 }
  }
};
