/**
 * GPU and Hardware Accelerator Catalog
 * Specs: VRAM, Memory Bandwidth, Tensor TFLOPS, TDP, Interconnect, Capex, and Cloud Rates
 */
export const GPU_CATALOG = [
  // --- Datacenter Frontier ---
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
  'h100-sxm': {
    aws: 'p5.48xlarge (8x H100)',
    azure: 'NDv5 (8x H100)',
    gcp: 'a3-highgpu-8g (8x H100)'
  },
  'h200-sxm': {
    aws: 'p5e.48xlarge (8x H200)',
    azure: 'NDv5-H200 (8x H200)',
    gcp: 'a3-megagpu-8g (8x H200)'
  },
  'b200': {
    aws: 'p6.48xlarge (8x B200)',
    azure: 'NDv6 (8x B200)',
    gcp: 'a4-highgpu-8g (8x B200)'
  },
  'a100-sxm-80gb': {
    aws: 'p4de.24xlarge (8x A100 80GB)',
    azure: 'ND96amsr_A100_v4 (8x A100)',
    gcp: 'a2-ultragpu-8g (8x A100)'
  },
  'l40s': {
    aws: 'g6e.12xlarge (4x L40S)',
    azure: 'NGads_V620 (L40S)',
    gcp: 'g2-standard (L40S)'
  },
  'l4': {
    aws: 'g6.xlarge (1x L4) / g6.12xlarge (4x L4)',
    azure: 'NC4as_T4_v3 (similar)',
    gcp: 'g2-standard-4 (1x L4)'
  }
};
