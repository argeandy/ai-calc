/**
 * Dell AI Factory Live Workshop Edition - Core Controller & Sizing Engine
 * Designed for Dell Workshops in Germany (30-40 Attendees, Live Beamer & Interactive Testing)
 */

// 3 High-Impact Use Cases with distinct workload profiles
export const WORKLOAD_TIERS = {
  'tier-1-rag': {
    id: 'tier-1-rag',
    tierNumber: 1,
    tierName: 'Tier 1: Departmental / Edge Inference',
    tierBadge: 'Entry / Departmental',
    tierClass: 'tier-1',
    badgeClass: 'tier-1-pill',
    title: 'Enterprise RAG & Interner Wissens-Assistent',
    subtitle: 'Interne Dokumentensuche (Confluence, Jira, PDFs) & Abteilungs-Chatbot für HR und Support',
    icon: '💬',
    modelName: 'Llama 3.1 8B Instruct',
    modelParams: '8.0 Mrd. Parameter (FP16 / FP8 KV)',
    modelWeightsGb: 16.5,
    defaultUsers: 150,
    minUsers: 20,
    maxUsers: 800,
    requestsPerUser: 20,
    peakMultiplier: 2.2,
    inputTokens: 3500,
    outputTokens: 400,
    targetTtftMs: 450,
    targetTps: 35,
    minBandwidthGbps: 864,
    // Dell Hardware
    dellChassis: 'Dell PowerEdge R760xa',
    chassisType: '4U Rackmount (Luftgekühlt, Standard 19"-Rack)',
    gpuModel: '2x NVIDIA L40S (48GB GDDR6 ECC)',
    gpuCount: 2,
    totalVramGb: 96,
    hostSpecs: 'Dual Intel Xeon Gold 6430 (64 Cores), 256 GB DDR5 ECC, 15.3 TB NVMe SSD',
    networking: '2x Dual-Port 100/200GbE Mellanox NICs',
    totalCapex: 31500,
    monthlyPowerWatts: 850,
    // Tipping Point & Decision Metrics
    tippingPointUsers: 70,
    tippingPointReqPerDay: '1.400 Req/Tag',
    // Comparison & Indicator
    readinessScore: 88,
    statusText: '✅ Dell AI Factory Tier 1 (Departmental) Sinnvoll',
    indicatorDecision: 'Sinnvoll ab 10.000 Anfragen/Monat ODER sofort, wenn DSGVO-relevante Mitarbeiter- oder Kundendaten verarbeitet werden. 100% On-Premises ohne Datenabfluss in fremde US-Clouds.',
    cloudEquivalent: 'OpenAI GPT-4o-mini / Hosted Llama 8B',
    cloudCostPer1MInput: 0.25,
    cloudCostPer1MOutput: 0.85,
    breakEvenBaseMonths: 14,
    monthlyTcoSavings: 1850,
    perks: [
      'Plug & Play in bestehende 19-Zoll Firmen-Racks (kein Rechenzentrums-Umbau nötig)',
      '100% DSGVO-konform: Keine internen HR/Patentdaten verlassen das Rechenzentrum',
      'Keine Cloud-Tokenlimits oder unvorhersehbare Monatsrechnungen',
      'Deterministische Latenz: <500ms Antwortbeginn für alle Mitarbeiter'
    ]
  },

  'tier-2-copilot': {
    id: 'tier-2-copilot',
    tierNumber: 2,
    tierName: 'Tier 2: Scale-Out Enterprise Factory',
    tierBadge: 'Enterprise Flagship',
    tierClass: 'tier-2',
    badgeClass: 'tier-2-pill',
    title: 'Developer Code Copilot & Enterprise Document Analytics',
    subtitle: 'Unternehmensweite Code-Completion für Entwickler & tiefe juristische Vertragsprüfung',
    icon: '💻',
    modelName: 'Llama 3.3 70B Instruct',
    modelParams: '70.6 Mrd. Parameter (FP8 Quantized)',
    modelWeightsGb: 74.5,
    defaultUsers: 800,
    minUsers: 150,
    maxUsers: 3500,
    requestsPerUser: 50,
    peakMultiplier: 2.4,
    inputTokens: 8000,
    outputTokens: 800,
    targetTtftMs: 320,
    targetTps: 50,
    minBandwidthGbps: 4800,
    // Dell Hardware
    dellChassis: 'Dell PowerEdge XE9680',
    chassisType: '6U Rackmount (High-Density Datacenter Server)',
    gpuModel: '8x NVIDIA H200 SXM (141GB HBM3e) NVLink Mesh',
    gpuCount: 8,
    totalVramGb: 1128,
    hostSpecs: 'Dual AMD EPYC 9654 (128 Cores), 1.5 TB DDR5-4800 ECC, 30.7 TB Gen5 NVMe',
    networking: '8x ConnectX-7 400Gb/s InfiniBand / Spectrum-X Ethernet',
    totalCapex: 322000,
    monthlyPowerWatts: 6500,
    // Tipping Point & Decision Metrics
    tippingPointUsers: 200,
    tippingPointReqPerDay: '10.000 Req/Tag',
    // Comparison & Indicator
    readinessScore: 96,
    statusText: '🔥 100% EMPFOHLEN: Dell AI Factory Enterprise Tier',
    indicatorDecision: 'Absoluter Enterprise-Standard ab 300+ Entwicklern oder 25.000 Anfragen/Tag! Externe Cloud-Tokenkosten explodieren bei diesem Volumen. Dell AI Factory amortisiert sich in ~14 Monaten und spart über 220.000 €/Jahr.',
    cloudEquivalent: 'Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o',
    cloudCostPer1MInput: 3.00,
    cloudCostPer1MOutput: 15.00,
    breakEvenBaseMonths: 14,
    monthlyTcoSavings: 18400,
    perks: [
      'Volle NVLink 4 NVSwitch Mesh: Bis zu 900 GB/s Interconnect zwischen allen 8 GPUs',
      'Ultraschnelle Inferenz: 50+ Tokens/Sekunde pro Entwickler ohne Cloud-Stau',
      'Amortisation nach ca. 14 Monaten gegenüber Cloud-API-Tokens',
      'Dell Validated Design für vLLM, TensorRT-LLM und Enterprise RAG Runtimes'
    ]
  },

  'tier-3-frontier': {
    id: 'tier-3-frontier',
    tierNumber: 3,
    tierName: 'Tier 3: Frontier / Supercomputing Factory (Liquid Cooled)',
    tierBadge: 'Frontier / DLC Liquid',
    tierClass: 'tier-3',
    badgeClass: 'tier-3-pill',
    title: 'Frontier Deep Reasoning, MoE & Autonome Agenten-Schwärme',
    subtitle: 'DeepSeek-R1 671B MoE, komplexe mathematische Reasoning-Ketten & 24/7 Agentic Autonomy',
    icon: '🧠',
    modelName: 'DeepSeek R1 (671B MoE Reasoning)',
    modelParams: '671 Mrd. MoE (37B aktiv) mit Deep Chain-of-Thought',
    modelWeightsGb: 345.0,
    defaultUsers: 3000,
    minUsers: 500,
    maxUsers: 10000,
    requestsPerUser: 30,
    peakMultiplier: 2.2,
    inputTokens: 16000,
    outputTokens: 3500,
    targetTtftMs: 650,
    targetTps: 32,
    minBandwidthGbps: 8000,
    // Dell Hardware
    dellChassis: 'Dell PowerEdge M9822 DLC / Dell PowerRack',
    chassisType: '2U Direct Liquid Cooled (DLC) Modular Rack Unit',
    gpuModel: '8x NVIDIA B200 DLC (192GB Liquid) oder Rubin NVL8',
    gpuCount: 8,
    totalVramGb: 1536,
    hostSpecs: 'NVIDIA Vera CPUs (Liquid Cooled), 2.0 TB High-Bandwidth Memory, 61.4 TB Gen6 NVMe',
    networking: '8x NVIDIA Quantum-X800 800Gb/s InfiniBand / Spectrum-X800',
    totalCapex: 420000,
    monthlyPowerWatts: 8200,
    // Tipping Point & Decision Metrics
    tippingPointUsers: 550,
    tippingPointReqPerDay: '16.500 Req/Tag',
    // Comparison & Indicator
    readinessScore: 99,
    statusText: '🚀 MISSION CRITICAL: Dell AI Factory Frontier Tier (DLC)',
    indicatorDecision: 'Unverzichtbar für 671B MoE Modelle und autonome Multi-Agenten-Loops! Bei 3.500 Reasoning-Tokens pro Request kosten Cloud-APIs über 65.000 €/Monat. Dell AI Factory mit Flüssigkühlung halbiert die TCO und ist nach ~7 Monaten im Plus.',
    cloudEquivalent: 'OpenAI o1 / Claude Opus 3.5 Reasoning API',
    cloudCostPer1MInput: 5.00,
    cloudCostPer1MOutput: 25.00,
    breakEvenBaseMonths: 7,
    monthlyTcoSavings: 58000,
    perks: [
      '100% Direct Liquid Cooling (DLC): PUE 1.12 spart bis zu 40% Kühlenergie',
      'Massiver VRAM-Pool (1.5 TB+ HBM3e/HBM4) für MLA Multi-Head Latent Attention',
      'Autonome 24/7 Agenten-Ausführung ohne Rate-Limits oder Token-Abrechnung',
      'Break-Even bereits nach ~7 Monaten dank extremer Cloud-Reasoning-Tokenpreise'
    ]
  },

  'tier-4-heavy-compute': {
    id: 'tier-4-heavy-compute',
    tierNumber: 4,
    tierName: 'Tier 4: 24/7 Heavy Compute (Training & Vision AI)',
    tierBadge: '24/7 Heavy Compute / Training',
    tierClass: 'tier-4',
    badgeClass: 'tier-4-pill',
    title: '24/7 Continuous Model Training & Real-Time Video AI',
    subtitle: 'Unabhängig von Nutzerzahlen: 100% GPU-Dauerlast für Domain Pretraining, Fine-Tuning & hunderte 4K Video-Streams (Computer Vision)',
    icon: '🎥',
    modelName: 'Vision-LLM (Florence-2 / YOLOv10) & Llama 70B Training',
    modelParams: 'Continuous Multi-Stream Inferenz & Distributed PyTorch FSDP',
    modelWeightsGb: 140.0,
    isStreamWorkload: true,
    defaultUsers: 256,
    minUsers: 32,
    maxUsers: 1024,
    unitName: 'Streams / Batches',
    requestsPerUser: 1,
    peakMultiplier: 1.0,
    inputTokens: 0,
    outputTokens: 0,
    targetTtftMs: 15,
    targetTps: 30,
    minBandwidthGbps: 4800,
    // Dell Hardware
    dellChassis: 'Dell PowerEdge XE9680 + PowerScale F900 All-Flash',
    chassisType: '6U High-Density Rackmount Server + InfiniBand Storage Fabric',
    gpuModel: '8x NVIDIA H200 SXM (141GB HBM3e) NVLink 900 GB/s Mesh',
    gpuCount: 8,
    totalVramGb: 1128,
    hostSpecs: 'Dual Intel Xeon Platinum 8592+ (128 Cores), 2.0 TB DDR5-5600, 61.4 TB NVMe Scratch',
    networking: '8x ConnectX-7 400Gb/s InfiniBand für GPU Direct Storage (GDS) & RoCEv2',
    totalCapex: 345000,
    monthlyPowerWatts: 7200,
    // Tipping Point & Decision Metrics
    tippingPointUsers: 32,
    tippingPointReqPerDay: '32 Video-Streams / >12h Training',
    // Comparison & Indicator
    readinessScore: 98,
    statusText: '🔥 100% EMPFOHLEN: Dell AI Factory Dauerlast-Champion',
    indicatorDecision: 'Bei 24/7 Dauerlast (Model Training oder Videoanalyse) ist die Cloud der teuerste aller Wege! Ein gemieteter 8x H200 Cloud-Knoten kostet über 24.000 €/Monat. Die Dell AI Factory amortisiert sich in ~12 Monaten, spart monatlich über 20.000 € und garantiert <15ms Latenz direkt vor Ort.',
    cloudEquivalent: 'AWS p5.48xlarge (8x H100/H200) On-Demand / Reserved',
    breakEvenBaseMonths: 12,
    monthlyTcoSavings: 22800,
    perks: [
      'GPUDirect Storage (GDS): Direkter Durchsatz zwischen Dell PowerScale NVMe und H200 HBM3e ohne CPU-Bottleneck',
      'Extremer Kostenvorteil: Cloud-Miete für 8x H200 (~24.000 €/Monat) übersteigt Anschaffungskosten nach ca. 12-14 Monaten',
      'Ultra-Low-Latency (<15ms): Echtzeit-Videoanalyse direkt an der Fertigungslinie ohne Cloud-Streaming-Latenz',
      'DSGVO & IP-Schutz: Proprietäre Trainingsdaten, biometrische Video-Feeds und Werksgeheimnisse bleiben 100% On-Premises'
    ]
  }
};

class WorkshopController {
  constructor() {
    this.currentTierKey = 'tier-2-copilot';
    this.currentUserCount = 800;
    this.isComputing = false;

    this.cacheDom();
    this.initTheme();
    this.bindEvents();
    this.initDefaultView();
  }

  cacheDom() {
    // Theme Switcher
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
    this.themeIcon = document.getElementById('theme-icon');
    this.themeLabel = document.getElementById('theme-label');

    // Inputs & Prompts
    this.chatInput = document.getElementById('chat-input');
    this.chatSubmitBtn = document.getElementById('chat-submit-btn');
    this.promptChips = document.querySelectorAll('.prompt-chip');

    // Agentic Console
    this.agenticConsole = document.getElementById('agentic-console');
    this.consoleStepsList = document.getElementById('console-steps-list');
    this.consoleSkipBtn = document.getElementById('console-skip-btn');

    // Results Dashboard & Placeholder
    this.resultsDashboard = document.getElementById('results-dashboard');
    this.workshopPlaceholder = document.getElementById('workshop-placeholder');

    // Readiness Elements
    this.readinessStatusBadge = document.getElementById('readiness-status-badge');
    this.readinessScoreVal = document.getElementById('readiness-score-val');
    this.readinessTitle = document.getElementById('readiness-title');
    this.readinessSubtitle = document.getElementById('readiness-subtitle');
    this.readinessDecision = document.getElementById('readiness-decision');

    // 4 Factors
    this.factorTcoValue = document.getElementById('factor-tco-value');
    this.factorTcoDesc = document.getElementById('factor-tco-desc');
    this.factorLatencyValue = document.getElementById('factor-latency-value');
    this.factorLatencyDesc = document.getElementById('factor-latency-desc');
    this.factorPrivacyValue = document.getElementById('factor-privacy-value');
    this.factorPrivacyDesc = document.getElementById('factor-privacy-desc');
    this.factorCapexValue = document.getElementById('factor-capex-value');
    this.factorCapexDesc = document.getElementById('factor-capex-desc');

    // Hardware Card
    this.tierPillBadge = document.getElementById('tier-pill-badge');
    this.serverHeroIcon = document.getElementById('server-hero-icon');
    this.serverHeroTitle = document.getElementById('server-hero-title');
    this.serverHeroSubtitle = document.getElementById('server-hero-subtitle');
    this.specGpu = document.getElementById('spec-gpu');
    this.specVram = document.getElementById('spec-vram');
    this.specBandwidth = document.getElementById('spec-bandwidth');
    this.specHost = document.getElementById('spec-host');
    this.specNetworking = document.getElementById('spec-networking');
    this.specFormfactor = document.getElementById('spec-formfactor');
    this.perksList = document.getElementById('perks-list');

    // Interactive What-If Slider
    this.userSlider = document.getElementById('user-slider');
    this.sliderLiveUsers = document.getElementById('slider-live-users');
    this.sliderMinUsers = document.getElementById('slider-min-users');
    this.sliderMaxUsers = document.getElementById('slider-max-users');
    this.liveRpsVal = document.getElementById('live-rps-val');
    this.liveTokensVal = document.getElementById('live-tokens-val');
    this.liveVramVal = document.getElementById('live-vram-val');
    this.liveMonthlySaving = document.getElementById('live-monthly-saving');

    // Tier Scale & Labels
    this.tierSeg1 = document.getElementById('tier-seg-1');
    this.tierSeg2 = document.getElementById('tier-seg-2');
    this.tierSeg3 = document.getElementById('tier-seg-3');
    this.tierSeg4 = document.getElementById('tier-seg-4');
    this.tierScaleLabel = document.getElementById('tier-scale-label');
    this.sliderLabelTitle = document.getElementById('slider-label-title');
    this.liveMetricLabel1 = document.getElementById('live-metric-label-1');
    this.liveMetricLabel2 = document.getElementById('live-metric-label-2');
    this.liveMetricLabel3 = document.getElementById('live-metric-label-3');
    this.liveMetricLabel4 = document.getElementById('live-metric-label-4');

    // Buttons & Modes
    this.btnBeamerToggle = document.getElementById('btn-beamer-toggle');
    this.btnCopySummary = document.getElementById('btn-copy-summary');
    this.toastElement = document.getElementById('workshop-toast');

    // Tipping-Point & Umstiegs-Indikator Elements
    this.tippingPointCard = document.getElementById('tipping-point-card');
    this.roiCircleProgress = document.getElementById('roi-circle-progress');
    this.roiRadialScore = document.getElementById('roi-radial-score');
    this.thresholdStatusPill = document.getElementById('threshold-status-pill');
    this.thresholdStatusText = document.getElementById('threshold-status-text');
    this.thresholdPointBadge = document.getElementById('threshold-point-badge');
    this.tippingPointThresholdVal = document.getElementById('tipping-point-threshold-val');
    this.thresholdPointer = document.getElementById('threshold-pointer');
    this.pointerBubble = document.getElementById('pointer-bubble');
    this.triggerCardVol = document.getElementById('trigger-card-vol');
    this.triggerVolBadge = document.getElementById('trigger-vol-badge');
    this.triggerVolText = document.getElementById('trigger-vol-text');
    this.triggerCardPrivacy = document.getElementById('trigger-card-privacy');
    this.togglePrivacyStrict = document.getElementById('toggle-privacy-strict');
    this.triggerPrivacyText = document.getElementById('trigger-privacy-text');
    this.triggerCardSla = document.getElementById('trigger-card-sla');
    this.triggerSlaBadge = document.getElementById('trigger-sla-badge');
    this.triggerSlaText = document.getElementById('trigger-sla-text');
  }

  initTheme() {
    const savedTheme = localStorage.getItem('ai_calc_theme') || 'dark';
    this.applyTheme(savedTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (this.themeIcon) {
      this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (this.themeLabel) {
      this.themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
    if (this.themeToggleBtn) {
      this.themeToggleBtn.title = theme === 'dark' ? 'Zu Light Mode wechseln' : 'Zu Dark Mode wechseln';
    }
  }

  bindEvents() {
    // Theme Switcher Toggle
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        localStorage.setItem('ai_calc_theme', nextTheme);
      });
    }
    // Form submit
    this.chatSubmitBtn.addEventListener('click', () => this.handlePromptSubmit());
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handlePromptSubmit();
      }
    });

    // Prompt Chips - Click directly triggers specific tier
    this.promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const promptText = chip.getAttribute('data-prompt') || '';
        const chipTier = chip.getAttribute('data-tier') || 'tier-1-rag';
        this.chatInput.value = promptText;
        this.promptChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const classification = this.classifyPrompt(promptText);
        // Explicitly execute the chosen chip tier!
        this.runAgenticPipeline(chipTier, classification.extractedUsers);
      });
    });

    // Console Skip
    if (this.consoleSkipBtn) {
      this.consoleSkipBtn.addEventListener('click', () => {
        this.skipConsoleAnimation = true;
      });
    }

    // What-If Slider
    this.userSlider.addEventListener('input', (e) => {
      this.currentUserCount = parseInt(e.target.value, 10);
      this.updateLiveCalculations();
    });

    // Beamer Toggle
    if (this.btnBeamerToggle) {
      this.btnBeamerToggle.addEventListener('click', () => {
        document.body.classList.toggle('beamer-mode');
        const isActive = document.body.classList.contains('beamer-mode');
        this.btnBeamerToggle.classList.toggle('active', isActive);
        this.btnBeamerToggle.innerHTML = isActive 
          ? '<span>📽️</span> Beamer-Modus AN' 
          : '<span>📽️</span> Beamer-Modus';
      });
    }

    // Copy Summary
    if (this.btnCopySummary) {
      this.btnCopySummary.addEventListener('click', () => this.copyArchitectureSummary());
    }

    // Interactive Privacy & DSGVO Priority Switch
    if (this.togglePrivacyStrict) {
      this.togglePrivacyStrict.addEventListener('change', () => {
        this.updateLiveCalculations();
        this.triggerSurgeAnimation();
      });
    }
  }

  initDefaultView() {
    // Check if URL specifies a tier (e.g. ?tier=1 or #tier-3)
    const urlParams = new URLSearchParams(window.location.search);
    const tierParam = urlParams.get('tier');
    if (tierParam === '1') {
      this.selectTier('tier-1-rag', 150, false);
    } else if (tierParam === '3') {
      this.selectTier('tier-3-frontier', 3000, false);
    } else if (tierParam === '4') {
      this.selectTier('tier-4-heavy-compute', 256, false);
    } else {
      // Default initial tier is Tier 2 (Developer Copilot)
      this.selectTier('tier-2-copilot', 800, false);
    }
  }

  /**
   * Natural Language Intent & Keyword Matcher with word boundary regex
   */
  classifyPrompt(text) {
    const lower = text.toLowerCase().trim();

    // 1. Check for explicit numbers of users/streams/cameras (e.g., "500 Entwickler", "200 Kameras", "3000 User")
    const userMatch = lower.match(/(\d+[\.\d]*)\s*(user|benutzer|mitarbeiter|entwickler|people|clients|agents|nutzer|kamera|kameras|camera|cameras|streams|feeds|cams|batches)/i);
    let extractedUsers = null;
    if (userMatch && userMatch[1]) {
      const cleanNum = parseInt(userMatch[1].replace(/\./g, ''), 10);
      if (!isNaN(cleanNum) && cleanNum > 0) {
        extractedUsers = cleanNum;
      }
    }

    // 2. Strict Keyword Classification
    // Case 4 triggers: Heavy Compute, 24/7 Dauerlast, Training, Fine-Tuning, Video, Videoanalyse, Kameras, Computer Vision, YOLO, Streams, Fabrik
    const tier4Regex = /\b(training|trainieren|train|fine-?tuning|finetuning|pre-?training|video|videoanalyse|kamera|kameras|camera|cameras|stream|streams|streaming|vision|computer vision|yolo|rtsp|surveillance|fertigung|fabrik|produktion|dauerlast|24\/7|non-stop|batch|florence|opencv)\b/i;
    if (tier4Regex.test(lower)) {
      return { tierKey: 'tier-4-heavy-compute', extractedUsers: extractedUsers || 256 };
    }

    // Case 3 triggers: DeepSeek, R1, V3, MoE, Reasoning, Chain-of-Thought, Agenten, Swarm, Frontier, Liquid, DLC
    const tier3Regex = /\b(deepseek|r1|v3|moe|reasoning|cot|agent|agenten|agentic|swarm|schwärme|schwarm|frontier|hyperscale|supercomputer|liquid|dlc|rubin|blackwell|b200|671b)\b/i;
    if (tier3Regex.test(lower)) {
      return { tierKey: 'tier-3-frontier', extractedUsers: extractedUsers || 3000 };
    }

    // Case 2 triggers: Copilot, Code, Coding, Entwickler, Legal, Vertrag, Verträge, Audit, Finance, 70B, Llama 3.3, Qwen
    const tier2Regex = /\b(copilot|code|coding|entwickler|programmierer|developer|legal|vertrag|verträge|audit|finance|finanzen|70b|72b|llama\s*3\.3|qwen)\b/i;
    if (tier2Regex.test(lower)) {
      return { tierKey: 'tier-2-copilot', extractedUsers: extractedUsers || 800 };
    }

    // Case 1 triggers: RAG, Confluence, FAQ, HR, Chatbot, Intern, Support, Helpdesk, Klein, Einstieg, 8B, 14B
    const tier1Regex = /\b(rag|confluence|faq|hr|chatbot|intern|interner|support|helpdesk|klein|einstieg|department|8b|14b|assist|suche|ticket|sharepoint|wissen|abteilung|dokumente)\b/i;
    if (tier1Regex.test(lower)) {
      return { tierKey: 'tier-1-rag', extractedUsers: extractedUsers || 150 };
    }

    // Default intelligent fallback based on user count if detected
    if (extractedUsers) {
      if (extractedUsers >= 2000) return { tierKey: 'tier-3-frontier', extractedUsers };
      if (extractedUsers >= 400) return { tierKey: 'tier-2-copilot', extractedUsers };
      return { tierKey: 'tier-1-rag', extractedUsers };
    }

    // Default enterprise selection
    return { tierKey: 'tier-2-copilot', extractedUsers: 800 };
  }

  handlePromptSubmit() {
    const query = this.chatInput.value.trim();
    if (!query || this.isComputing) return;

    const classification = this.classifyPrompt(query);
    this.runAgenticPipeline(classification.tierKey, classification.extractedUsers);
  }

  /**
   * "Fake"-KI Agentic Thinking Animation Pipeline
   */
  async runAgenticPipeline(tierKey, userCount) {
    this.isComputing = true;
    this.skipConsoleAnimation = false;
    this.chatSubmitBtn.disabled = true;
    this.chatSubmitBtn.innerHTML = '<span>⚡</span> Berechne...';

    // Highlight matching chip if matches
    this.promptChips.forEach(chip => {
      const chipTier = chip.getAttribute('data-tier');
      chip.classList.toggle('active', chipTier === tierKey);
    });

    const tier = WORKLOAD_TIERS[tierKey];

    // Show console
    this.agenticConsole.style.display = 'block';
    if (this.workshopPlaceholder) {
      this.workshopPlaceholder.style.display = 'none';
    }

    // Step definitions
    let steps;
    if (tierKey === 'tier-4-heavy-compute') {
      steps = [
        {
          icon: '🔍',
          text: `Phase 1: Intent & Domain Parsing`,
          detail: `Erkannt: "${tier.title}" • Skalierungsziel: ca. ${userCount} Streams / Batches (24/7 Dauerlast)`
        },
        {
          icon: '🎥',
          text: `Phase 2: Multi-Stream & GPU Duty-Cycle Modellierung`,
          detail: `Modell: ${tier.modelName} • 100% GPU-Dauerlast (Non-Stop Compute) • Zero-Copy GPUDirect I/O`
        },
        {
          icon: '🧮',
          text: `Phase 3: VRAM-Bandbreite & Storage Throughput`,
          detail: `1.128 GB HBM3e VRAM Pool • InfiniBand 400Gb/s Fabric • Dell PowerScale F900 NVMe All-Flash`
        },
        {
          icon: '🏭',
          text: `Phase 4: Dell AI Factory Validated Architecture Mapping`,
          detail: `Ziel-Chassis: ${tier.dellChassis} • ${tier.chassisType}`
        },
        {
          icon: '💰',
          text: `Phase 5: TCO Dauerlast-Paradoxon & Break-Even Synthese`,
          detail: `Cloud-Miete (~24.000 €/M) explodiert • Dell Break-Even: ~${tier.breakEvenBaseMonths} Monate • DSGVO: 100% On-Premises`
        }
      ];
    } else {
      steps = [
        {
          icon: '🔍',
          text: `Phase 1: Intent & Domain Parsing`,
          detail: `Erkannt: "${tier.title}" • Skalierungsziel: ca. ${userCount} Nutzer`
        },
        {
          icon: '⚡',
          text: `Phase 2: Tokenomics & Concurrency Modellierung`,
          detail: `Modell: ${tier.modelName} • Kontext: ${tier.inputTokens.toLocaleString('de-DE')} In / ${tier.outputTokens.toLocaleString('de-DE')} Out Tokens`
        },
        {
          icon: '🧮',
          text: `Phase 3: VRAM & Bandbreiten-Kalkulation`,
          detail: `Gewichte-VRAM: ~${tier.modelWeightsGb} GB • PagedAttention KV-Cache • Min. Bandbreite: ${tier.minBandwidthGbps} GB/s`
        },
        {
          icon: '🏭',
          text: `Phase 4: Dell AI Factory Validated Architecture Mapping`,
          detail: `Ziel-Chassis: ${tier.dellChassis} (${tier.gpuModel}) • ${tier.chassisType}`
        },
        {
          icon: '✅',
          text: `Phase 5: TCO & Readiness Synthese`,
          detail: `Break-Even: ~${tier.breakEvenBaseMonths} Monate • DSGVO-Validierung: 100% On-Premises`
        }
      ];
    }

    // Render step items
    this.consoleStepsList.innerHTML = steps.map((s, idx) => `
      <div class="console-step-item" id="console-step-${idx}">
        <span class="step-icon">${s.icon}</span>
        <div class="step-text">
          <strong>${s.text}</strong>
          <span class="step-detail">${s.detail}</span>
        </div>
      </div>
    `).join('');

    // Animate steps sequentially
    for (let i = 0; i < steps.length; i++) {
      if (this.skipConsoleAnimation) break;

      const stepEl = document.getElementById(`console-step-${i}`);
      if (stepEl) {
        stepEl.classList.add('active');
      }

      await this.sleep(350);

      if (stepEl) {
        stepEl.classList.remove('active');
        stepEl.classList.add('completed');
      }
    }

    // Finish computation
    await this.sleep(150);
    this.agenticConsole.style.display = 'none';
    this.selectTier(tierKey, userCount, true);

    this.isComputing = false;
    this.chatSubmitBtn.disabled = false;
    this.chatSubmitBtn.innerHTML = '<span>⚡</span> Analysieren';

    // Smooth scroll to results
    this.resultsDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  selectTier(tierKey, userCount, animate = true) {
    this.currentTierKey = tierKey;
    const tier = WORKLOAD_TIERS[tierKey];

    // Configure slider boundaries
    this.currentUserCount = Math.max(tier.minUsers, Math.min(tier.maxUsers, userCount || tier.defaultUsers));
    this.userSlider.min = tier.minUsers;
    this.userSlider.max = tier.maxUsers;
    this.userSlider.value = this.currentUserCount;
    this.sliderMinUsers.textContent = `${tier.minUsers} User`;
    this.sliderMaxUsers.textContent = `${tier.maxUsers} User`;

    // Render Tier Details
    this.renderTierDetails(tier);
    this.updateLiveCalculations();

    this.resultsDashboard.style.display = 'block';
  }

  renderTierDetails(tier) {
    // 1. Readiness Banner
    this.readinessStatusBadge.textContent = tier.statusText;
    this.readinessScoreVal.textContent = `${tier.readinessScore}% Score`;
    this.readinessTitle.textContent = tier.title;
    this.readinessSubtitle.textContent = tier.subtitle;
    this.readinessDecision.textContent = tier.indicatorDecision;

    // 2. Hardware Spec Card
    this.tierPillBadge.textContent = tier.tierBadge;
    this.tierPillBadge.className = `tier-pill-badge ${tier.badgeClass}`;
    this.serverHeroIcon.textContent = tier.icon;
    this.serverHeroTitle.textContent = tier.dellChassis;
    this.serverHeroSubtitle.textContent = `${tier.gpuModel} • ${tier.chassisType}`;

    this.specGpu.textContent = tier.gpuModel;
    this.specVram.textContent = `${tier.totalVramGb} GB VRAM (${tier.modelName})`;
    this.specBandwidth.textContent = `≥ ${tier.minBandwidthGbps} GB/s Memory Bandwidth`;
    this.specHost.textContent = tier.hostSpecs;
    this.specNetworking.textContent = tier.networking;
    this.specFormfactor.textContent = tier.chassisType;

    // Perks
    this.perksList.innerHTML = tier.perks.map(p => `<li>${p}</li>`).join('');

    // Update 4-tier visual scale
    this.tierSeg1.classList.toggle('active', tier.tierNumber === 1);
    this.tierSeg2.classList.toggle('active', tier.tierNumber === 2);
    this.tierSeg3.classList.toggle('active', tier.tierNumber === 3);
    if (this.tierSeg4) this.tierSeg4.classList.toggle('active', tier.tierNumber === 4);
    this.tierScaleLabel.textContent = `Aktiv: ${tier.tierName}`;

    // Dynamic UI labels for Stream / Heavy Compute vs Normal User
    if (tier.tierNumber === 4) {
      if (this.sliderLabelTitle) this.sliderLabelTitle.textContent = '📹 24/7 Dauerlast-Skalierung (Kamera-Streams & Batches)';
      if (this.liveMetricLabel1) this.liveMetricLabel1.textContent = 'GPU Duty-Cycle';
      if (this.liveMetricLabel2) this.liveMetricLabel2.textContent = 'Video Inferenz Rate';
      if (this.liveMetricLabel3) this.liveMetricLabel3.textContent = 'Aktiver VRAM-Pool';
      this.sliderMinUsers.textContent = '32 Streams';
      this.sliderMaxUsers.textContent = '1.024 Streams';
    } else {
      if (this.sliderLabelTitle) this.sliderLabelTitle.textContent = '👥 Aktive Nutzer (Live Skalierung)';
      if (this.liveMetricLabel1) this.liveMetricLabel1.textContent = 'Peak Request Rate';
      if (this.liveMetricLabel2) this.liveMetricLabel2.textContent = 'Token Durchsatz';
      if (this.liveMetricLabel3) this.liveMetricLabel3.textContent = 'Benötigter VRAM';
      this.sliderMinUsers.textContent = `${tier.minUsers} User`;
      this.sliderMaxUsers.textContent = `${tier.maxUsers} User`;
    }

    // Update Tipping Point Threshold Badge & Trigger SLA
    if (this.tippingPointThresholdVal) {
      this.tippingPointThresholdVal.textContent = `ab ~${tier.tippingPointUsers} (${tier.tippingPointReqPerDay})`;
    }
    if (this.triggerSlaBadge) {
      this.triggerSlaBadge.textContent = `< ${tier.targetTtftMs}ms TTFT`;
    }
    if (this.triggerSlaText) {
      this.triggerSlaText.textContent = tier.tierNumber === 4
        ? `< 15ms Ultra-Low-Latency Edge/On-Prem Inferenz direkt an der Fabrik / im Campus vor Ort ohne Cloud-Latenz.`
        : `Garantierte Latenz von < ${tier.targetTtftMs}ms und ${tier.targetTps} Tok/s ohne Cloud-Drosselung oder Rate-Limits.`;
    }
  }

  /**
   * Smooth number animation tweening (Count-Up effect)
   */
  animateNumber(element, startVal, endVal, duration = 300, formatFn = (n) => n.toString()) {
    if (!element) return;
    const sVal = typeof startVal === 'number' && !isNaN(startVal) ? startVal : 0;
    const eVal = typeof endVal === 'number' && !isNaN(endVal) ? endVal : 0;
    if (sVal === eVal) {
      element.textContent = formatFn(eVal);
      element._currentNumVal = eVal;
      return;
    }
    const startTime = performance.now();
    const diff = eVal - sVal;
    
    if (element._animFrameId) {
      cancelAnimationFrame(element._animFrameId);
    }

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = sVal + diff * ease;
      element.textContent = formatFn(current);
      if (progress < 1) {
        element._animFrameId = requestAnimationFrame(step);
      } else {
        element.textContent = formatFn(eVal);
        element._currentNumVal = eVal;
        element._animFrameId = null;
      }
    };
    element._animFrameId = requestAnimationFrame(step);
  }

  /**
   * Visual celebration surge when crossing tipping point or toggling strict privacy
   */
  triggerSurgeAnimation() {
    if (this.thresholdStatusPill) {
      this.thresholdStatusPill.classList.remove('status-surge');
      void this.thresholdStatusPill.offsetWidth;
      this.thresholdStatusPill.classList.add('status-surge');
    }
    if (this.roiRadialScore) {
      this.roiRadialScore.classList.remove('value-pop');
      void this.roiRadialScore.offsetWidth;
      this.roiRadialScore.classList.add('value-pop');
    }
  }

  updateLiveCalculations() {
    const tier = WORKLOAD_TIERS[this.currentTierKey];
    const users = this.currentUserCount;

    // 1. Calculations by Workload Type (Normal User vs 24/7 Stream/Training Heavy Compute)
    let peakRps, peakTokensSec, totalEstimatedVram, monthlySavings, breakEvenMonths;

    if (tier.tierNumber === 4) {
      // 24/7 Heavy Compute (Video Streams or Model Training)
      const streams = users;
      const totalFps = streams * 30; // 30 FPS realtime
      peakTokensSec = totalFps;
      peakRps = 100; // 100% duty cycle
      totalEstimatedVram = 1128; // full GPU cluster memory pool

      // Cloud Monthly Cost: 8x H200 instance rental (730 h * $32.50 = ~22.600 €) + video egress/storage bandwidth
      const cloudMonthlyApi = 22600 + (streams * 12);
      // Dell On-Prem running cost (Power 7.2 kW * 24 * 30.5 * 0.22 € = 1.160 € + Maintenance ~2.300 €)
      const onPremRunningMonth = 3460;

      monthlySavings = Math.max(16000, Math.round(cloudMonthlyApi - onPremRunningMonth));
      breakEvenMonths = Math.max(5, Math.round(tier.totalCapex / monthlySavings));

      // Update Slider text
      this.sliderLiveUsers.textContent = `${streams.toLocaleString('de-DE')} Streams / Batches`;

      // Live metrics
      this.liveRpsVal.textContent = '100% Non-Stop';
      const prevTokens = this.liveTokensVal._currentNumVal || 0;
      this.animateNumber(this.liveTokensVal, prevTokens, totalFps, 250, (n) => `${Math.round(n).toLocaleString('de-DE')} FPS`);
      this.liveVramVal.textContent = '1.128 GB';

      const prevSavings = this.liveMonthlySaving._currentNumVal || 0;
      this.animateNumber(this.liveMonthlySaving, prevSavings, monthlySavings, 250, (n) => `~${Math.round(n).toLocaleString('de-DE')} €/M`);

      // 4 Decision Factors
      this.factorTcoValue.textContent = `~${breakEvenMonths} Monate`;
      if (this.factorTcoDesc) {
        this.factorTcoDesc.textContent = `Spart ca. ${monthlySavings.toLocaleString('de-DE')} €/Monat ggü. Cloud GPU Miete`;
      }
      this.factorLatencyValue.textContent = `< 15 ms (Edge)`;
      if (this.factorLatencyDesc) {
        this.factorLatencyDesc.textContent = `Ultra-Low Edge Inferenz ohne Cloud-Streaming-Latenz`;
      }
      this.factorPrivacyValue.textContent = `100% On-Prem`;
      if (this.factorPrivacyDesc) {
        this.factorPrivacyDesc.textContent = `Videodaten & Trainingsdaten verlassen das Firmennetz nicht`;
      }
      this.factorCapexValue.textContent = `${(tier.totalCapex / 1000).toFixed(1)}k €`;
      if (this.factorCapexDesc) {
        this.factorCapexDesc.textContent = `Dell Turnkey inkl. PowerScale NVMe Storage`;
      }
    } else {
      // Human-driven inference (Tiers 1-3)
      const dailyRequests = users * tier.requestsPerUser;
      const workSeconds = 8 * 3600;
      const avgRps = dailyRequests / workSeconds;
      peakRps = avgRps * tier.peakMultiplier;
      const tokensPerReq = tier.inputTokens + tier.outputTokens;
      peakTokensSec = Math.round(peakRps * tokensPerReq);

      // VRAM Dynamic
      const estReqSec = (tier.targetTtftMs / 1000) + (tier.outputTokens / tier.targetTps);
      const peakConcurrentStreams = Math.max(1, Math.ceil(peakRps * estReqSec));
      const kvPerStreamGb = ((tier.inputTokens + tier.outputTokens) * 0.0000045) * (tier.tierNumber === 3 ? 0.35 : 1.0);
      const totalKvGb = Math.round(peakConcurrentStreams * kvPerStreamGb * 1.05);
      totalEstimatedVram = Math.round(tier.modelWeightsGb + totalKvGb + 6);

      // Financials & TCO
      const monthlyDays = 30.5;
      const monthlyInputTokens = users * tier.requestsPerUser * tier.inputTokens * monthlyDays;
      const monthlyOutputTokens = users * tier.requestsPerUser * tier.outputTokens * monthlyDays;

      const cloudMonthlyApi = (
        (monthlyInputTokens / 1_000_000) * tier.cloudCostPer1MInput +
        (monthlyOutputTokens / 1_000_000) * tier.cloudCostPer1MOutput
      );

      const powerKwhMonth = (tier.monthlyPowerWatts / 1000) * 24 * monthlyDays * 1.25;
      const powerCostMonth = powerKwhMonth * 0.22;
      const maintMonth = (tier.totalCapex * 0.10) / 12;
      const onPremRunningMonth = Math.round(powerCostMonth + maintMonth);

      monthlySavings = Math.max(500, Math.round(cloudMonthlyApi - onPremRunningMonth));
      breakEvenMonths = Math.max(3, Math.round(tier.totalCapex / monthlySavings));

      // Update Slider text
      this.sliderLiveUsers.textContent = `${users.toLocaleString('de-DE')} User`;

      // Live metrics
      this.liveRpsVal.textContent = `${peakRps.toFixed(1)} req/s`;
      const prevTokens = this.liveTokensVal._currentNumVal || 0;
      this.animateNumber(this.liveTokensVal, prevTokens, peakTokensSec, 250, (n) => `${Math.round(n).toLocaleString('de-DE')} tok/s`);
      this.liveVramVal.textContent = `${totalEstimatedVram} GB`;

      const prevSavings = this.liveMonthlySaving._currentNumVal || 0;
      this.animateNumber(this.liveMonthlySaving, prevSavings, monthlySavings, 250, (n) => `~${Math.round(n).toLocaleString('de-DE')} €/M`);

      // 4 Decision Factors
      this.factorTcoValue.textContent = `~${breakEvenMonths} Monate`;
      if (this.factorTcoDesc) {
        this.factorTcoDesc.textContent = `Spart ca. ${monthlySavings.toLocaleString('de-DE')} €/Monat ggü. Cloud API`;
      }
      this.factorLatencyValue.textContent = `< ${tier.targetTtftMs} ms`;
      if (this.factorLatencyDesc) {
        this.factorLatencyDesc.textContent = `Konstante ${tier.targetTps} Tok/s ohne Cloud-Drosselung`;
      }
      this.factorCapexValue.textContent = `${(tier.totalCapex / 1000).toFixed(1)}k €`;
      if (this.factorCapexDesc) {
        this.factorCapexDesc.textContent = `Dell Turnkey Capex inkl. Chassis & GPUs`;
      }
    }

    // =========================================================================
    // TIPPING-POINT & BREAK-EVEN LOGIC (Eindeutiger Umstiegs-Indikator)
    // =========================================================================
    const tippingUsers = tier.tippingPointUsers;
    const isPrivacyStrict = Boolean(this.togglePrivacyStrict && this.togglePrivacyStrict.checked);
    const hasReachedVolume = users >= tippingUsers;
    const isDellAiFactoryProfitable = isPrivacyStrict || hasReachedVolume;

    // Detect state transition for surge animation
    if (this._lastTippingProfitable !== undefined && this._lastTippingProfitable !== isDellAiFactoryProfitable) {
      this.triggerSurgeAnimation();
    }
    this._lastTippingProfitable = isDellAiFactoryProfitable;

    let roiScore = 50;
    let pointerLeftPct = 28;

    if (isPrivacyStrict) {
      // 1. Mandatory Privacy Override
      if (this.thresholdStatusPill) {
        this.thresholdStatusPill.className = 'threshold-status-pill mandatory-mode';
      }
      if (this.thresholdStatusText) {
        this.thresholdStatusText.innerHTML = '🚨 <strong>DATENSCHUTZ-PRIORITÄT:</strong> 100% On-Premises zwingend (Kein Datenabfluss an Cloud)';
      }
      if (this.triggerCardPrivacy) this.triggerCardPrivacy.classList.add('active');
      if (this.triggerPrivacyText) {
        this.triggerPrivacyText.innerHTML = '<strong>Aktiviert:</strong> Höchste Sicherheitsstufe. Betriebsgeheimnisse, Patente und HR-Daten dürfen die Firmenfirewall nicht verlassen.';
      }
      if (this.triggerCardVol) this.triggerCardVol.classList.toggle('active', hasReachedVolume);
      if (this.triggerVolBadge) {
        this.triggerVolBadge.className = hasReachedVolume ? 'trigger-badge pass' : 'trigger-badge info';
        this.triggerVolBadge.textContent = hasReachedVolume ? 'Schwelle erreicht' : `${users} / ${tippingUsers} User`;
      }

      roiScore = 99;
      // Position pointer on Dell side
      pointerLeftPct = Math.max(50, 28 + (users / tier.maxUsers) * 65);
      if (this.pointerBubble) {
        this.pointerBubble.textContent = `${users.toLocaleString('de-DE')} User (DSGVO-Mandat)`;
      }
      if (this.roiCircleProgress) {
        this.roiCircleProgress.style.stroke = 'var(--dell-cyan)';
      }
    } else if (hasReachedVolume) {
      // 2. Break-Even Reached & Exceeded by Volume
      if (this.thresholdStatusPill) {
        this.thresholdStatusPill.className = 'threshold-status-pill';
      }
      if (this.thresholdStatusText) {
        this.thresholdStatusText.innerHTML = `✅ <strong>DELL AI FACTORY LOHNT SICH VOLL</strong> (Break-Even nach ~${breakEvenMonths} Monaten)`;
      }
      if (this.triggerCardPrivacy) this.triggerCardPrivacy.classList.remove('active');
      if (this.triggerPrivacyText) {
        this.triggerPrivacyText.innerHTML = 'Schalter aktivieren: Bei strengem Datenschutz (IP, HR, Verträge, Finanzen) ist Dell AI Factory <strong>ab Tag 1 zwingend</strong>.';
      }
      if (this.triggerCardVol) this.triggerCardVol.classList.add('active');
      if (this.triggerVolBadge) {
        this.triggerVolBadge.className = 'trigger-badge pass';
        this.triggerVolBadge.textContent = 'Schwelle überschritten';
      }
      if (this.triggerVolText) {
        if (tier.tierNumber === 4) {
          this.triggerVolText.textContent = `24/7 Dauerlast mit ${users.toLocaleString('de-DE')} Streams / Batches: Ein gemieteter Cloud 8x H200 Knoten kostet ~25.000 €/Monat! Dell AI Factory On-Prem spart ca. ${monthlySavings.toLocaleString('de-DE')} €/Monat.`;
        } else {
          this.triggerVolText.textContent = `Mit ${users.toLocaleString('de-DE')} Nutzern (${Math.round(users * tier.requestsPerUser).toLocaleString('de-DE')} Req/Tag) spart die Dell AI Factory ca. ${monthlySavings.toLocaleString('de-DE')} €/Monat ggü. Cloud APIs!`;
        }
      }

      // Dynamic ROI Score between 80% and 98%
      const volumeExcessRatio = Math.min(1, (users - tippingUsers) / Math.max(1, tier.maxUsers - tippingUsers));
      roiScore = Math.min(98, Math.round(80 + volumeExcessRatio * 18));

      // Pointer moves from 28% to 94%
      pointerLeftPct = 28 + volumeExcessRatio * 66;
      if (this.pointerBubble) {
        this.pointerBubble.textContent = `${users.toLocaleString('de-DE')} ${tier.tierNumber === 4 ? 'Streams' : 'User'} (Rentabel)`;
      }
      if (this.roiCircleProgress) {
        this.roiCircleProgress.style.stroke = '#10b981';
      }
    } else {
      // 3. Below Tipping Point
      if (this.thresholdStatusPill) {
        this.thresholdStatusPill.className = 'threshold-status-pill warning-mode';
      }
      if (this.thresholdStatusText) {
        this.thresholdStatusText.innerHTML = `☁️ <strong>PUBLIC CLOUD NOCH GÜNSTIGER</strong> (Kipp-Punkt liegt bei ~${tippingUsers} ${tier.tierNumber === 4 ? 'Streams' : 'Nutzern'})`;
      }
      if (this.triggerCardPrivacy) this.triggerCardPrivacy.classList.remove('active');
      if (this.triggerPrivacyText) {
        this.triggerPrivacyText.innerHTML = 'Schalter aktivieren: Bei strengem Datenschutz (IP, HR, Verträge, Finanzen) ist Dell AI Factory <strong>ab Tag 1 zwingend</strong>.';
      }
      if (this.triggerCardVol) this.triggerCardVol.classList.remove('active');
      if (this.triggerVolBadge) {
        this.triggerVolBadge.className = 'trigger-badge info';
        this.triggerVolBadge.textContent = 'Unter Schwelle';
      }
      if (this.triggerVolText) {
        this.triggerVolText.textContent = tier.tierNumber === 4
          ? `Aktuell ${users.toLocaleString('de-DE')} Streams. Für kurze Tests ist Cloud flexibel. Bei Dauerlast amortisiert sich Dell ab ${tippingUsers} Streams.`
          : `Aktuell ${users.toLocaleString('de-DE')} Nutzer. Für geringe Testlasten ist Cloud flexibler. Ab ${tippingUsers} Nutzern (${tier.tippingPointReqPerDay}) rechnet sich Dell AI Factory.`;
      }

      // Dynamic ROI score below tipping point (30% to 74%)
      const belowRatio = users / tippingUsers;
      roiScore = Math.max(25, Math.round(belowRatio * 74));

      // Pointer moves from 6% to 26%
      pointerLeftPct = 6 + belowRatio * 20;
      if (this.pointerBubble) {
        this.pointerBubble.textContent = `${users.toLocaleString('de-DE')} ${tier.tierNumber === 4 ? 'Streams' : 'User'} (Cloud flexibler)`;
      }
      if (this.roiCircleProgress) {
        this.roiCircleProgress.style.stroke = '#f59e0b';
      }
    }

    // Update Pointer position
    if (this.thresholdPointer) {
      this.thresholdPointer.style.left = `${pointerLeftPct.toFixed(1)}%`;
    }

    // Update Radial Speedometer Circle & Animated Score Text
    if (this.roiCircleProgress) {
      const strokeDashoffset = 314.159 * (1 - roiScore / 100);
      this.roiCircleProgress.style.strokeDashoffset = strokeDashoffset;
    }
    if (this.roiRadialScore) {
      const prevScore = this.roiRadialScore._currentNumVal || 0;
      this.animateNumber(this.roiRadialScore, prevScore, roiScore, 300, (n) => `${Math.round(n)}%`);
    }

    // Dynamic Scaling Alert Banner if slider exceeds tier sweetspot
    const scaleAlertEl = document.getElementById('scaling-warning-box');
    if (scaleAlertEl) {
      if (tier.tierNumber === 1 && users > 500) {
        scaleAlertEl.style.display = 'block';
        scaleAlertEl.innerHTML = `⚠️ <strong>Skalierungs-Hinweis:</strong> Bei ${users} Nutzern stößt die L40S PCIe Bandbreite an ihre Grenzen. Upgrade auf <strong>Tier 2 (Dell PowerEdge XE9680 mit H200)</strong> empfohlen!`;
      } else if (tier.tierNumber === 2 && users < 100) {
        scaleAlertEl.style.display = 'block';
        scaleAlertEl.innerHTML = `💡 <strong>Effizienz-Tipp:</strong> Für nur ${users} Nutzer ist ein 8x H200 System überdimensioniert. <strong>Tier 1 (Dell PowerEdge R760xa)</strong> spart ca. 290.000 € Anschaffungskosten!`;
      } else if (tier.tierNumber === 3 && users < 400) {
        scaleAlertEl.style.display = 'block';
        scaleAlertEl.innerHTML = `💡 <strong>Kapazitäts-Hinweis:</strong> Dieses Frontier DLC-System hat massive Reserven für bis zu 10.000 gleichzeitige Nutzer oder 24/7 Agenten-Schwärme.`;
      } else if (tier.tierNumber === 4 && users > 800) {
        scaleAlertEl.style.display = 'block';
        scaleAlertEl.innerHTML = `💡 <strong>Multi-Node Cluster Empfehlung:</strong> Bei über ${users} parallelen 4K Video-Streams oder großem Pretraining empfiehlt sich ein Multi-Node Cluster aus 2-4x Dell PowerEdge XE9680 mit InfiniBand Fabric.`;
      } else {
        scaleAlertEl.style.display = 'none';
      }
    }
  }

  copyArchitectureSummary() {
    const tier = WORKLOAD_TIERS[this.currentTierKey];
    const text = `
=== Dell AI Factory Architecture Summary ===
Workshop Sizing: ${tier.title} (${tier.tierBadge})
- ${tier.tierNumber === 4 ? '24/7 Kamera-Streams / Batches' : 'Aktive Nutzer'}: ${this.currentUserCount.toLocaleString('de-DE')}
- Modell: ${tier.modelName} (${tier.modelParams})
- Hardware: ${tier.dellChassis} (${tier.gpuModel})
- VRAM & Durchsatz: ${tier.totalVramGb} GB VRAM • ${this.liveTokensVal.textContent}
- Dell Turnkey Investition: ca. ${tier.totalCapex.toLocaleString('de-DE')} €
- TCO Break-Even: ca. ${this.factorTcoValue.textContent}
- Vorteil: ${tier.indicatorDecision}
============================================
Erstellt mit der Dell AI Factory Live Workshop Edition
`.trim();

    navigator.clipboard.writeText(text).then(() => {
      this.showToast('📋 Architektur-Zusammenfassung in die Zwischenablage kopiert!');
    }).catch(() => {
      this.showToast('Fehler beim Kopieren.');
    });
  }

  showToast(message) {
    if (!this.toastElement) return;
    this.toastElement.textContent = message;
    this.toastElement.style.display = 'block';
    setTimeout(() => {
      this.toastElement.style.display = 'none';
    }, 2800);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.workshopApp = new WorkshopController();
});
