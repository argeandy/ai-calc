/**
 * Enterprise Server Chassis Catalog (Dell PowerEdge, Supermicro, HPE, Workstation)
 */
export const SERVER_CHASSIS_CATALOG = [
  {
    id: 'dell-xe9680',
    name: 'Dell PowerEdge XE9680 (8x SXM HGX)',
    vendor: 'Dell Technologies',
    formFactor: '6U Rackmount',
    heightRu: 6, // 6 Rack Units (HE)
    maxGpus: 8,
    gpuType: 'SXM / OAM',
    hostCpu: 'Dual AMD EPYC 9654 (2x 64-Cores, 128 Threads)',
    hostMemory: '1.5 TB DDR5-4800 ECC (24x 64GB DIMMs)',
    hostStorage: '30.7 TB PCIe Gen5 NVMe Enterprise SSDs',
    psu: '6x 3000W Titanium Redundant (Hot-plug 3+3)',
    networking: '8x NVIDIA ConnectX-7 400Gb/s InfiniBand / RoCE NICs',
    baseChassisPrice: 34000,
    hostIdlePowerWatts: 850,
    description: 'High-Performance 8-GPU Datacenter Server für H100, H200 und B200 SXM Module mit voller NVLink 4/5 NVSwitch Mesh Architektur.',
    descriptionEn: 'Flagship 8-GPU datacenter server for H100, H200, and B200 SXM modules with complete NVLink NVSwitch mesh.'
  },
  {
    id: 'supermicro-8u-hgx',
    name: 'Supermicro GPU SuperServer (8x SXM)',
    vendor: 'Supermicro',
    formFactor: '8U Rackmount',
    heightRu: 8, // 8 Rack Units (HE)
    maxGpus: 8,
    gpuType: 'SXM / OAM',
    hostCpu: 'Dual Intel Xeon Platinum 8480+ (2x 56-Cores)',
    hostMemory: '2.0 TB DDR5-4800 ECC (32x 64GB DIMMs)',
    hostStorage: '30.7 TB PCIe Gen5 NVMe Enterprise SSDs',
    psu: '6x 3000W Titanium Redundant',
    networking: '8x 400Gb/s InfiniBand / BlueField-3 DPUs',
    baseChassisPrice: 32000,
    hostIdlePowerWatts: 800,
    description: 'Robuster 8U Server für extreme Rechenleistung und maximale thermische Kühleffizienz in dichten GPU-Rechenzentren.',
    descriptionEn: 'Robust 8U server for maximum compute density and optimal cooling in high-power AI datacenters.'
  },
  {
    id: 'dell-r760xa',
    name: 'Dell PowerEdge R760xa (4x PCIe Gen5)',
    vendor: 'Dell Technologies',
    formFactor: '4U Rackmount',
    heightRu: 4, // 4 Rack Units (HE)
    maxGpus: 4,
    gpuType: 'PCIe Dual-Width',
    hostCpu: 'Dual Intel Xeon Gold 6430 (2x 32-Cores)',
    hostMemory: '512 GB DDR5-4800 ECC (16x 32GB DIMMs)',
    hostStorage: '15.3 TB PCIe Gen4/Gen5 NVMe SSDs',
    psu: '4x 2800W Titanium Redundant',
    networking: '2x Dual-Port 100/200GbE Mellanox NICs',
    baseChassisPrice: 16500,
    hostIdlePowerWatts: 450,
    description: 'Optimiert für PCIe-Inferenz-Beschleuniger wie NVIDIA L40S und RTX 6000 Ada in Standard-Server-Racks.',
    descriptionEn: 'Optimized for PCIe inference GPUs like NVIDIA L40S and RTX 6000 Ada in standard enterprise racks.'
  },
  {
    id: 'supermicro-4u-pcie',
    name: 'Supermicro A+ Server (8x PCIe)',
    vendor: 'Supermicro',
    formFactor: '4U Rackmount',
    heightRu: 4, // 4 Rack Units (HE)
    maxGpus: 8,
    gpuType: 'PCIe Dual-Width',
    hostCpu: 'Dual AMD EPYC 9354 (2x 32-Cores)',
    hostMemory: '768 GB DDR5 ECC',
    hostStorage: '15.3 TB NVMe SSDs',
    psu: '4x 2600W Titanium Redundant',
    networking: '4x 100GbE / 200GbE NICs',
    baseChassisPrice: 19000,
    hostIdlePowerWatts: 500,
    description: 'Vielseitiger 4U Server für bis zu 8x PCIe Dual-Slot GPUs (z.B. 8x L40S oder 8x L4) ohne NVLink-Zwang.',
    descriptionEn: 'Versatile 4U server holding up to 8x PCIe dual-slot GPUs (e.g. 8x L40S or 8x L4) on standard PCIe switches.'
  },
  {
    id: 'dell-precision-7960',
    name: 'Dell Precision 7960 Workstation',
    vendor: 'Dell Technologies',
    formFactor: '5U Rackable Tower',
    heightRu: 5, // 5 Rack Units (HE)
    maxGpus: 2,
    gpuType: 'PCIe Workstation',
    hostCpu: 'Intel Xeon w7-3465X (28-Core High Clock)',
    hostMemory: '256 GB DDR5 ECC (8x 32GB)',
    hostStorage: '8 TB PCIe Gen4 NVMe M.2 SSDs',
    psu: '2x 2200W Platinum Redundant',
    networking: 'Dual 10GbE RJ45 + 1x 25GbE SFP28',
    baseChassisPrice: 5200,
    hostIdlePowerWatts: 180,
    description: 'Leise High-End Workstation für Entwickler und Abteilungs-Server (z.B. mit 2x RTX 5090 oder 2x RTX 6000 Ada).',
    descriptionEn: 'Quiet professional workstation for local LLM development with 2x high-end GPUs.'
  },
  {
    id: 'apple-silicon-studio',
    name: 'Apple Mac Studio (All-in-One Chassis)',
    vendor: 'Apple Inc.',
    formFactor: 'Compact Desktop / 1U Shelf',
    heightRu: 1, // 1U Shelf Tray
    maxGpus: 1,
    gpuType: 'Integrated Unified Memory SoC',
    hostCpu: 'Apple M2/M4 Ultra (24/32-Core CPU)',
    hostMemory: '128 GB - 192 GB Unified LPDDR5X (800 GB/s)',
    hostStorage: '2 TB - 4 TB Integrated High-Speed SSD',
    psu: '370W Internal Power Supply',
    networking: '10GbE Ethernet + Wi-Fi 6E',
    baseChassisPrice: 0,
    hostIdlePowerWatts: 25,
    description: 'Integrierte Desktop-Hardware mit Shared Unified Memory zwischen CPU und GPU. Extrem leise und energieeffizient (~150W Peak).',
    descriptionEn: 'Integrated compact device with high-bandwidth unified memory. Silent and ultra energy-efficient (~150W peak).'
  }
];
