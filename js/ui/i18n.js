/**
 * Internationalization (DE / EN) Dictionary and Helper
 */

export const TRANSLATIONS = {
  de: {
    // Header & Meta
    appTitle: 'AI Hardware & Sizing Calculator',
    appSubtitle: 'Dimensionierung & TCO-Rechner für LLM-Inferenz, vLLM-Cluster und GPU-Infrastruktur',
    langButtonLabel: 'DE',
    themeToggleTitle: 'Theme wechseln (Dark / Light)',
    langToggleTitle: 'Sprache wechseln (DE / EN)',

    // Tabs
    tabSizing: 'Dimensionierung & Sizing',
    tabTco: 'TCO & Kostenanalyse',
    tabTopology: 'Cluster & Topologie',
    tabExport: 'Export & Report (ADR)',

    // Presets & Sidebar
    presetsTitle: 'Usecase-Vorlagen',
    trafficTitle: '1. Benutzer & Lastprofil',
    tokenTitle: '2. Token-Verbrauch & Latenz',
    modelTitle: '3. LLM & Quantisierung',
    infraParamsTitle: '4. Engine & PagedAttention',

    totalUsers: 'Potenzielle Benutzer (Total)',
    reqPerUser: 'Anfragen pro Benutzer / Tag',
    workHours: 'Aktive Arbeitsstunden / Tag',
    peakMultiplier: 'Peak-Faktor (Spitzenlast Multiplikator)',
    inputTokens: 'Eingabe-Tokens (Prompt & RAG Context)',
    outputTokens: 'Ausgabe-Tokens (Completion)',
    targetTtft: 'Ziel TTFT (Time to First Token in ms)',
    targetTps: 'Ziel-Generierungsrate (tok/s pro Stream)',
    gpuMemUtil: 'vLLM GPU Memory Utilization (Headroom)',

    selectModel: 'Modell auswählen',
    customModel: 'Benutzerdefiniertes Modell...',
    customParams: 'Parameter (B)',
    customLayers: 'Layers',
    customKvHeads: 'KV-Heads (GQA)',
    customHiddenSize: 'Hidden Size',
    quantization: 'Gewichte-Quantisierung',
    kvQuantization: 'KV-Cache Präzision',

    // VRAM Card
    recomVram: 'Empfohlener VRAM (+ Headroom)',
    vramSubtext: 'inkl. vLLM Headroom / Margin',
    weightsVram: 'Modell-Gewichte',
    kvCacheVram: 'KV-Cache (Parallel)',
    overheadVram: 'CUDA & Activation Buffer',
    totalVramReq: 'Gesamter VRAM-Bedarf',
    modelWeightsPill: 'Modell',
    kvCachePill: 'KV-Cache',
    bufferPill: 'Buffer',

    // Metrics Cards
    concurrentStreams: 'Parallele Streams (Peak)',
    concurrentStreamsHint: 'Gleichzeitige aktive Inferenz-Streams',
    peakRps: 'Peak RPS (Spitzenlast)',
    peakRpsHint: 'Ø Anfragen/s | Req/Tag',
    peakOutputTokensSec: 'Ausgabe-Tokens / Sekunde (Peak)',
    peakOutputTokensSecHint: 'Gesamtvolumen',
    estDuration: 'Geschätzte Dauer / Request',
    estDurationHint: 'Ziel TTFT / Speed',

    // GPU Matrix & Highlights
    badgeOptimal: 'Optimaler Datacenter Cluster',
    badgeValue: 'Preis-Leistungs-Tipp',
    badgeLocal: 'Lokale Workstation / Edge',
    speedPerUser: 'Speed / User:',
    ttftLabel: 'TTFT:',
    powerLabel: 'Leistung:',
    vramUtilization: 'Auslastung',

    colGpuName: 'GPU / Beschleuniger',
    colGpuCount: 'Anzahl GPUs',
    colTopology: 'Topology (TP/PP/DP)',
    colVramTotal: 'VRAM Gesamt',
    colVramUtil: 'VRAM Auslastung',
    colSpeed: 'Speed / User',
    colTtft: 'Est. TTFT',
    colPower: 'Power',
    colCapex: 'Capex (On-Prem)',
    colCloud: 'Cloud 1Y Res.',
    colSla: 'SLA Status',

    slaOptimal: 'Optimal (SLA erfüllt)',
    slaAcceptable: 'Akzeptabel',
    slaBottleneck: 'Bottleneck',

    // TCO Tab
    tcoTitle: 'TCO & Kostenanalyse',
    tcoSelectedTitle: 'Kostenberechnung für:',
    tcoSelectedDesc: 'Basierend auf Anfragen pro Tag und monatlichem Token-Volumen',
    tcoGpuSwitcherLabel: 'GPU-Setup für TCO wechseln:',
    sliderElectricity: 'Strompreis (€ / kWh):',
    sliderPue: 'Datacenter PUE (Kühleffizienz):',
    sliderAmortization: 'Hardware-Abschreibungsdauer:',
    years: 'Jahre',
    onPremBadge: '🏢 On-Premises Eigenbetrieb (3 Jahre)',
    cloudBadge: '☁️ Cloud Reserved (1 Jahr)',
    perMonth: '/ Monat',
    per1kTokens: 'pro 1k Tokens',
    capexTotal: 'Hardware-Capex (gesamt):',
    monthlyDeprec: 'Monatl. Abschreibung:',
    monthlyElectricity: 'Strom & Kühlung:',
    monthlyMaint: 'Wartung & Support (12%/J):',
    cloud3Yr: 'Cloud 3-Jahre Reserved:',
    cloudOnDemand: 'Cloud On-Demand:',
    cloudCapexZero: '€0 (Kein Investitionsrisiko)',
    cloudMaintIncluded: 'Inklusive',
    apiComparisonTitle: 'Vergleich mit kommerziellen Token-APIs',
    apiComparisonDesc: 'Was würde dieses Token-Volumen bei externen API-Anbietern kosten?',
    amortizationAfter: 'Amortisation nach',
    months: 'Monate',
    apiCheaperAtLowVolume: 'API bei geringer Last günstiger',

    // Topology Tab
    topologyTitle: 'Cluster-Topologie & Parallelismus-Architektur',
    topologyDesc: 'Visuelle Aufteilung von GPUs auf Server-Nodes',
    serverNode: 'Server Node',
    cloudInstancesTitle: 'Äquivalente Cloud-Instanzen',

    // Export Tab
    exportTitle: 'Bericht & Konfiguration exportieren',
    exportDesc: 'Exportiere die Dimensionierung als Architekturentscheidung (ADR), lade die JSON-Konfiguration herunter oder teile den Link.',
    copyMarkdown: 'Markdown / ADR kopieren',
    downloadJson: 'JSON-Konfiguration herunterladen',
    shareUrl: 'Link teilen (URL-Zustand kopieren)',
    printReport: 'Druckansicht / PDF erstellen',
    copiedToast: 'In die Zwischenablage kopiert!',
    urlCopiedToast: 'Link in die Zwischenablage kopiert!'
  },
  en: {
    // Header & Meta
    appTitle: 'AI Hardware & Sizing Calculator',
    appSubtitle: 'Sizing & TCO Calculator for LLM Inference, vLLM Clusters, and GPU Infrastructure',
    langButtonLabel: 'EN',
    themeToggleTitle: 'Toggle Theme (Dark / Light)',
    langToggleTitle: 'Toggle Language (DE / EN)',

    // Tabs
    tabSizing: 'Sizing & Capacity',
    tabTco: 'TCO & Cost Analysis',
    tabTopology: 'Cluster & Topology',
    tabExport: 'Export & Report (ADR)',

    // Presets & Sidebar
    presetsTitle: 'Workload Presets',
    trafficTitle: '1. Users & Traffic Profile',
    tokenTitle: '2. Token Consumption & Latency',
    modelTitle: '3. LLM & Quantization',
    infraParamsTitle: '4. Engine & PagedAttention',

    totalUsers: 'Total Potential Users',
    reqPerUser: 'Requests per User / Day',
    workHours: 'Active Work Hours / Day',
    peakMultiplier: 'Peak Burst Multiplier',
    inputTokens: 'Input Tokens (Prompt & RAG Context)',
    outputTokens: 'Output Tokens (Completion)',
    targetTtft: 'Target TTFT (Time to First Token in ms)',
    targetTps: 'Target Generation Speed (tok/s per stream)',
    gpuMemUtil: 'vLLM GPU Memory Utilization (Headroom)',

    selectModel: 'Select Model',
    customModel: 'Custom Model...',
    customParams: 'Parameters (B)',
    customLayers: 'Layers',
    customKvHeads: 'KV-Heads (GQA)',
    customHiddenSize: 'Hidden Size',
    quantization: 'Weight Quantization',
    kvQuantization: 'KV-Cache Precision',

    // VRAM Card
    recomVram: 'Recommended VRAM (+ Headroom)',
    vramSubtext: 'incl. vLLM Headroom / Margin',
    weightsVram: 'Model Weights',
    kvCacheVram: 'KV-Cache (Concurrent)',
    overheadVram: 'CUDA & Activation Buffer',
    totalVramReq: 'Total Raw VRAM',
    modelWeightsPill: 'Model',
    kvCachePill: 'KV-Cache',
    bufferPill: 'Buffer',

    // Metrics Cards
    concurrentStreams: 'Concurrent Active Streams (Peak)',
    concurrentStreamsHint: 'Simultaneous active inference streams',
    peakRps: 'Peak RPS (Burst)',
    peakRpsHint: 'Avg Requests/s | Req/Day',
    peakOutputTokensSec: 'Peak Output Tokens / Sec',
    peakOutputTokensSecHint: 'Total volume',
    estDuration: 'Estimated Duration / Request',
    estDurationHint: 'Target TTFT / Speed',

    // GPU Matrix & Highlights
    badgeOptimal: 'Optimal Datacenter Cluster',
    badgeValue: 'Best Value / Enterprise',
    badgeLocal: 'Local Workstation / Edge',
    speedPerUser: 'Speed / Stream:',
    ttftLabel: 'TTFT:',
    powerLabel: 'Power:',
    vramUtilization: 'Utilization',

    colGpuName: 'GPU / Accelerator',
    colGpuCount: 'GPU Count',
    colTopology: 'Topology (TP/PP/DP)',
    colVramTotal: 'Total VRAM',
    colVramUtil: 'VRAM Utilization',
    colSpeed: 'Speed / Stream',
    colTtft: 'Est. TTFT',
    colPower: 'Power',
    colCapex: 'Capex (On-Prem)',
    colCloud: 'Cloud 1Y Res.',
    colSla: 'SLA Status',

    slaOptimal: 'Optimal (SLA met)',
    slaAcceptable: 'Acceptable',
    slaBottleneck: 'Bottleneck',

    // TCO Tab
    tcoTitle: 'TCO & Cost Analysis',
    tcoSelectedTitle: 'Cost calculation for:',
    tcoSelectedDesc: 'Based on daily requests and monthly token volume',
    tcoGpuSwitcherLabel: 'Switch GPU setup for TCO:',
    sliderElectricity: 'Electricity Price (€ / kWh):',
    sliderPue: 'Datacenter PUE (Cooling Efficiency):',
    sliderAmortization: 'Hardware Amortization Period:',
    years: 'Years',
    onPremBadge: '🏢 On-Premises Dedicated (3-Year)',
    cloudBadge: '☁️ Cloud Reserved (1-Year)',
    perMonth: '/ Month',
    per1kTokens: 'per 1k Tokens',
    capexTotal: 'Hardware Capex (Total):',
    monthlyDeprec: 'Monthly Depreciation:',
    monthlyElectricity: 'Power & Cooling:',
    monthlyMaint: 'Maintenance & Support (12%/Yr):',
    cloud3Yr: 'Cloud 3-Year Reserved:',
    cloudOnDemand: 'Cloud On-Demand:',
    cloudCapexZero: '€0 (Zero Capex Risk)',
    cloudMaintIncluded: 'Included',
    apiComparisonTitle: 'Comparison with Commercial Token APIs',
    apiComparisonDesc: 'What would this token volume cost with external API providers?',
    amortizationAfter: 'Break-even after',
    months: 'months',
    apiCheaperAtLowVolume: 'API cheaper at low volume',

    // Topology Tab
    topologyTitle: 'Cluster Topology & Parallelism Architecture',
    topologyDesc: 'Visual partitioning of GPUs across server nodes',
    serverNode: 'Server Node',
    cloudInstancesTitle: 'Equivalent Cloud Instances',

    // Export Tab
    exportTitle: 'Export Report & Configuration',
    exportDesc: 'Export the sizing architecture decision record (ADR), download JSON configuration, or share the link.',
    copyMarkdown: 'Copy Markdown / ADR',
    downloadJson: 'Download JSON Config',
    shareUrl: 'Share Configuration (Copy URL)',
    printReport: 'Print / Save as PDF',
    copiedToast: 'Copied to clipboard!',
    urlCopiedToast: 'Link copied to clipboard!'
  }
};

let currentLanguage = 'de';

export function setLanguage(lang) {
  if (TRANSLATIONS[lang]) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
  }
}

export function getLanguage() {
  return currentLanguage;
}

export function t(key) {
  return (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) ||
    (TRANSLATIONS['de'] && TRANSLATIONS['de'][key]) ||
    key;
}
