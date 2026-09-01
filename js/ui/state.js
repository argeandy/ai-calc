/**
 * State Management and URL Serialization for AI Sizing Calculator
 */

import { MODEL_CATALOG, QUANTIZATION_TYPES, KV_CACHE_PRECISIONS } from '../data/models.js';
import { USECASE_PRESETS } from '../data/presets.js';

export const DEFAULT_STATE = {
  activePresetId: 'enterprise-rag',
  modelId: 'llama-3.3-70b',
  quantId: 'fp8',
  kvQuantId: 'fp8',
  totalUsers: 1000,
  requestsPerUserPerDay: 20,
  workHours: 8,
  peakMultiplier: 2.5,
  inputTokens: 3500,
  outputTokens: 450,
  targetTtftMs: 600,
  targetTpsPerStream: 35,
  gpuMemoryUtilization: 0.90,

  // Custom model fields (if modelId === 'custom')
  customModel: {
    name: 'Custom LLM',
    parameters: 70,
    activeParameters: 70,
    layers: 80,
    hiddenSize: 8192,
    attentionHeads: 64,
    kvHeads: 8,
    headDim: 128
  },

  // TCO cost parameters
  costParams: {
    selectedGpuId: 'h100-sxm',
    electricityKwhCost: 0.22,
    pueFactor: 1.25,
    hardwareAmortizationYears: 3,
    maintenanceRatePerYear: 0.12
  },

  activeTab: 'sizing',
  theme: 'dark',
  lang: 'de'
};

class StateManager {
  constructor() {
    this.state = { ...DEFAULT_STATE };
    this.subscribers = [];
  }

  init() {
    // Check localStorage or URL hash
    this.loadFromUrlHash();
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('ai_calc_theme');
    if (savedTheme) {
      this.state.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.state.theme = 'light';
    }

    // Check saved language
    const savedLang = localStorage.getItem('ai_calc_lang');
    if (savedLang) {
      this.state.lang = savedLang;
    }

    window.addEventListener('hashchange', () => {
      this.loadFromUrlHash();
      this.notify();
    });
  }

  getState() {
    return this.state;
  }

  updateState(partial) {
    this.state = { ...this.state, ...partial };
    this.syncToUrlHash();
    this.notify();
  }

  updateCostParams(partial) {
    this.state.costParams = { ...this.state.costParams, ...partial };
    this.syncToUrlHash();
    this.notify();
  }

  updateCustomModel(partial) {
    this.state.customModel = { ...this.state.customModel, ...partial };
    this.syncToUrlHash();
    this.notify();
  }

  applyPreset(presetId) {
    const preset = USECASE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    this.updateState({
      activePresetId: preset.id,
      modelId: preset.modelId,
      quantId: preset.quantId,
      kvQuantId: preset.kvQuantId,
      totalUsers: preset.totalUsers,
      requestsPerUserPerDay: preset.requestsPerUserPerDay,
      peakMultiplier: preset.peakMultiplier,
      workHours: preset.workHours,
      inputTokens: preset.inputTokens,
      outputTokens: preset.outputTokens,
      targetTtftMs: preset.targetTtftMs,
      targetTpsPerStream: preset.targetTpsPerStream
    });
  }

  getSelectedModel() {
    if (this.state.modelId === 'custom') {
      return {
        id: 'custom',
        name: this.state.customModel.name || 'Custom LLM',
        provider: 'Custom',
        category: 'Custom Defined',
        parameters: Number(this.state.customModel.parameters) || 70,
        activeParameters: Number(this.state.customModel.activeParameters) || Number(this.state.customModel.parameters) || 70,
        layers: Number(this.state.customModel.layers) || 80,
        hiddenSize: Number(this.state.customModel.hiddenSize) || 8192,
        attentionHeads: Number(this.state.customModel.attentionHeads) || 64,
        kvHeads: Number(this.state.customModel.kvHeads) || 8,
        headDim: Number(this.state.customModel.headDim) || 128
      };
    }
    return MODEL_CATALOG.find(m => m.id === this.state.modelId) || MODEL_CATALOG[0];
  }

  getSelectedQuant() {
    return QUANTIZATION_TYPES.find(q => q.id === this.state.quantId) || QUANTIZATION_TYPES[0];
  }

  getSelectedKvQuant() {
    return KV_CACHE_PRECISIONS.find(k => k.id === this.state.kvQuantId) || KV_CACHE_PRECISIONS[0];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.state));
  }

  syncToUrlHash() {
    try {
      const payload = {
        p: this.state.activePresetId,
        m: this.state.modelId,
        q: this.state.quantId,
        kq: this.state.kvQuantId,
        u: this.state.totalUsers,
        r: this.state.requestsPerUserPerDay,
        h: this.state.workHours,
        pm: this.state.peakMultiplier,
        it: this.state.inputTokens,
        ot: this.state.outputTokens,
        tt: this.state.targetTtftMs,
        tps: this.state.targetTpsPerStream,
        gpuU: this.state.gpuMemoryUtilization
      };
      if (this.state.modelId === 'custom') {
        payload.cm = this.state.customModel;
      }
      const serialized = encodeURIComponent(JSON.stringify(payload));
      window.history.replaceState(null, '', `#cfg=${serialized}`);
    } catch (e) {
      console.warn('Could not sync state to URL hash', e);
    }
  }

  loadFromUrlHash() {
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#cfg=')) {
        const rawJson = decodeURIComponent(hash.substring(5));
        const p = JSON.parse(rawJson);
        if (p) {
          this.state.activePresetId = p.p || this.state.activePresetId;
          this.state.modelId = p.m || this.state.modelId;
          this.state.quantId = p.q || this.state.quantId;
          this.state.kvQuantId = p.kq || this.state.kvQuantId;
          this.state.totalUsers = p.u !== undefined ? p.u : this.state.totalUsers;
          this.state.requestsPerUserPerDay = p.r !== undefined ? p.r : this.state.requestsPerUserPerDay;
          this.state.workHours = p.h !== undefined ? p.h : this.state.workHours;
          this.state.peakMultiplier = p.pm !== undefined ? p.pm : this.state.peakMultiplier;
          this.state.inputTokens = p.it !== undefined ? p.it : this.state.inputTokens;
          this.state.outputTokens = p.ot !== undefined ? p.ot : this.state.outputTokens;
          this.state.targetTtftMs = p.tt !== undefined ? p.tt : this.state.targetTtftMs;
          this.state.targetTpsPerStream = p.tps !== undefined ? p.tps : this.state.targetTpsPerStream;
          this.state.gpuMemoryUtilization = p.gpuU !== undefined ? p.gpuU : this.state.gpuMemoryUtilization;
          if (p.cm) this.state.customModel = p.cm;
        }
      }
    } catch (e) {
      console.warn('Failed to parse state from URL hash', e);
    }
  }
}

export const stateManager = new StateManager();
