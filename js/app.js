/**
 * Main Application Entry Point
 * Event Listeners, State Binding & UI Updates
 */

import { stateManager } from './ui/state.js';
import { HardwareCalculator } from './engine/calculator.js';
import { TcoCalculator } from './engine/tco.js';
import { GPU_CATALOG } from './data/gpus.js';
import { UIRenderer } from './ui/renderer.js';
import { ExportManager } from './ui/export.js';
import { t, setLanguage, getLanguage } from './ui/i18n.js';

class App {
  constructor() {
    this.elements = {};
  }

  init() {
    stateManager.init();
    setLanguage(stateManager.getState().lang);
    this.cacheDomElements();
    this.bindEvents();
    this.applyTheme(stateManager.getState().theme);

    // Subscribe to state changes
    stateManager.subscribe((state) => {
      this.recalculateAndRender(state);
    });

    // Initial calculation and render
    this.recalculateAndRender(stateManager.getState());
  }

  cacheDomElements() {
    this.elements = {
      themeToggle: document.getElementById('theme-toggle-btn'),
      langToggle: document.getElementById('lang-toggle-btn'),
      presetsContainer: document.getElementById('presets-grid'),
      vramContainer: document.getElementById('vram-breakdown-card'),
      metricsContainer: document.getElementById('metrics-grid'),
      gpuMatrixContainer: document.getElementById('gpu-matrix-section'),
      tcoContainer: document.getElementById('tco-tab-content'),
      topologyContainer: document.getElementById('topology-tab-content'),
      exportContainer: document.getElementById('export-tab-content'),
      modelSelect: document.getElementById('model-select'),
      quantSelect: document.getElementById('quant-select'),
      kvQuantSelect: document.getElementById('kv-quant-select'),
      tabButtons: document.querySelectorAll('.nav-tab-btn'),
      tabPanes: document.querySelectorAll('.tab-pane')
    };
  }

  bindEvents() {
    // Theme Toggle
    if (this.elements.themeToggle) {
      this.elements.themeToggle.addEventListener('click', () => {
        const nextTheme = stateManager.getState().theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        stateManager.updateState({ theme: nextTheme });
        localStorage.setItem('ai_calc_theme', nextTheme);
      });
    }

    // Language Toggle
    if (this.elements.langToggle) {
      this.elements.langToggle.addEventListener('click', () => {
        const nextLang = getLanguage() === 'de' ? 'en' : 'de';
        setLanguage(nextLang);
        stateManager.updateState({ lang: nextLang });
        localStorage.setItem('ai_calc_lang', nextLang);
        this.updateStaticLabels();
      });
    }

    // Tab Navigation
    this.elements.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        this.switchTab(tabId);
      });
    });

    // Preset Selection Click
    if (this.elements.presetsContainer) {
      this.elements.presetsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.preset-card');
        if (card) {
          const presetId = card.getAttribute('data-preset-id');
          stateManager.applyPreset(presetId);
        }
      });
    }

    // Model Select
    if (this.elements.modelSelect) {
      this.elements.modelSelect.addEventListener('change', (e) => {
        stateManager.updateState({ modelId: e.target.value, activePresetId: null });
      });
    }

    // Custom Model Inputs
    const customParamsInput = document.getElementById('custom-params');
    const customLayersInput = document.getElementById('custom-layers');
    const customKvHeadsInput = document.getElementById('custom-kv-heads');
    const customHiddenSizeInput = document.getElementById('custom-hidden-size');

    [customParamsInput, customLayersInput, customKvHeadsInput, customHiddenSizeInput].forEach(el => {
      if (el) {
        el.addEventListener('input', () => {
          stateManager.updateCustomModel({
            parameters: Number(customParamsInput.value) || 70,
            activeParameters: Number(customParamsInput.value) || 70,
            layers: Number(customLayersInput.value) || 80,
            kvHeads: Number(customKvHeadsInput.value) || 8,
            hiddenSize: Number(customHiddenSizeInput.value) || 8192
          });
        });
      }
    });

    // Quantization Select
    if (this.elements.quantSelect) {
      this.elements.quantSelect.addEventListener('change', (e) => {
        stateManager.updateState({ quantId: e.target.value, activePresetId: null });
      });
    }

    // KV Cache Select
    if (this.elements.kvQuantSelect) {
      this.elements.kvQuantSelect.addEventListener('change', (e) => {
        stateManager.updateState({ kvQuantId: e.target.value, activePresetId: null });
      });
    }

    // Numeric Sliders & Inputs 2-way binding
    this.bindNumericPair('total-users-input', 'total-users-slider', 'totalUsers');
    this.bindNumericPair('req-user-input', 'req-user-slider', 'requestsPerUserPerDay');
    this.bindNumericPair('work-hours-input', 'work-hours-slider', 'workHours');
    this.bindNumericPair('peak-multiplier-input', 'peak-multiplier-slider', 'peakMultiplier');
    this.bindNumericPair('input-tokens-input', 'input-tokens-slider', 'inputTokens');
    this.bindNumericPair('output-tokens-input', 'output-tokens-slider', 'outputTokens');
    this.bindNumericPair('target-ttft-input', 'target-ttft-slider', 'targetTtftMs');
    this.bindNumericPair('target-tps-input', 'target-tps-slider', 'targetTpsPerStream');
    this.bindNumericPair('gpu-mem-util-input', 'gpu-mem-util-slider', 'gpuMemoryUtilization');

    // Global click delegate for GPU Table Row selection
    document.addEventListener('click', (e) => {
      const gpuRow = e.target.closest('.gpu-row');
      if (gpuRow) {
        const gpuId = gpuRow.getAttribute('data-gpu-id');
        if (gpuId) {
          stateManager.updateCostParams({ selectedGpuId: gpuId });
        }
      }

      // Export Buttons
      if (e.target.closest('#btn-copy-markdown') || e.target.closest('#btn-copy-markdown-inline')) {
        const code = document.querySelector('.markdown-code code');
        if (code) {
          ExportManager.copyToClipboard(code.textContent, t('copiedToast'));
        }
      }

      if (e.target.closest('#btn-download-json')) {
        const state = stateManager.getState();
        const model = stateManager.getSelectedModel();
        const quant = stateManager.getSelectedQuant();
        const kvQuant = stateManager.getSelectedKvQuant();
        const calcResult = HardwareCalculator.calculate(state, model, quant, kvQuant, GPU_CATALOG);
        ExportManager.downloadJsonConfig(state, calcResult);
      }

      if (e.target.closest('#btn-share-link')) {
        ExportManager.copyToClipboard(window.location.href, 'Link in die Zwischenablage kopiert!');
      }

      if (e.target.closest('#btn-print-report')) {
        window.print();
      }
    });

    // Delegate TCO controls
    document.addEventListener('input', (e) => {
      if (e.target.id === 'slider-electricity') {
        const val = Number(e.target.value);
        document.getElementById('val-electricity').textContent = val.toFixed(2);
        stateManager.updateCostParams({ electricityKwhCost: val });
      }
      if (e.target.id === 'slider-pue') {
        const val = Number(e.target.value);
        document.getElementById('val-pue').textContent = val.toFixed(2);
        stateManager.updateCostParams({ pueFactor: val });
      }
      if (e.target.id === 'slider-amortization') {
        const val = Number(e.target.value);
        document.getElementById('val-amortization').textContent = val;
        stateManager.updateCostParams({ hardwareAmortizationYears: val });
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target.id === 'tco-gpu-select') {
        stateManager.updateCostParams({ selectedGpuId: e.target.value });
      }
    });
  }

  bindNumericPair(numId, sliderId, stateProp) {
    const numEl = document.getElementById(numId);
    const sliderEl = document.getElementById(sliderId);

    if (numEl && sliderEl) {
      numEl.addEventListener('input', () => {
        const val = Number(numEl.value);
        sliderEl.value = val;
        stateManager.updateState({ [stateProp]: val, activePresetId: null });
      });

      sliderEl.addEventListener('input', () => {
        const val = Number(sliderEl.value);
        numEl.value = val;
        stateManager.updateState({ [stateProp]: val, activePresetId: null });
      });
    }
  }

  switchTab(tabId) {
    stateManager.updateState({ activeTab: tabId });
    this.elements.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    this.elements.tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabId}`);
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  updateStaticLabels() {
    // Re-render everything with new translations
    this.recalculateAndRender(stateManager.getState());
  }

  recalculateAndRender(state) {
    const model = stateManager.getSelectedModel();
    const quant = stateManager.getSelectedQuant();
    const kvQuant = stateManager.getSelectedKvQuant();

    // Execute core sizing math
    const calcResult = HardwareCalculator.calculate(
      state,
      model,
      quant,
      kvQuant,
      GPU_CATALOG
    );

    // Update active tab buttons if needed
    this.elements.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === state.activeTab);
    });
    this.elements.tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${state.activeTab}`);
    });

    // Render UI components
    UIRenderer.renderAll(state, calcResult, this.elements);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
