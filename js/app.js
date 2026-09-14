/**
 * Main Application Entry Point
 * Event Listeners, State Binding & UI Updates
 */

import { stateManager } from './ui/state.js?v=v1.3.1-465b6f3';
import { HardwareCalculator } from './engine/calculator.js?v=v1.3.1-465b6f3';
import { TcoCalculator } from './engine/tco.js?v=v1.3.1-465b6f3';
import { GPU_CATALOG } from './data/gpus.js?v=v1.3.1-465b6f3';
import { MODEL_CATALOG } from './data/models.js?v=v1.3.1-465b6f3';
import { UIRenderer } from './ui/renderer.js?v=v1.3.1-465b6f3';
import { ExportManager } from './ui/export.js?v=v1.3.1-465b6f3';
import { t, setLanguage, getLanguage } from './ui/i18n.js?v=v1.3.1-465b6f3';

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

    // Initialize background version checker
    this.initVersionChecker();
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
      basicModelSelect: document.getElementById('basic-model-select'),
      quantSelect: document.getElementById('quant-select'),
      kvQuantSelect: document.getElementById('kv-quant-select'),
      tabButtons: document.querySelectorAll('.nav-tab-btn'),
      tabPanes: document.querySelectorAll('.tab-pane'),
      configSidebar: document.getElementById('config-sidebar'),
      sidebarMobileToggle: document.getElementById('sidebar-mobile-toggle'),
      btnSidebarToggle: document.getElementById('btn-sidebar-toggle'),
      sidebarActiveSummary: document.getElementById('sidebar-active-summary'),
      toggleActionLabel: document.getElementById('toggle-action-label'),
      updateBanner: document.getElementById('app-update-banner'),
      btnReloadApp: document.getElementById('btn-reload-app'),
      btnDismissUpdate: document.getElementById('btn-dismiss-update')
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

    // Mode Switch (Basic / Advanced)
    const modeBtnBasic = document.getElementById('mode-btn-basic');
    const modeBtnAdvanced = document.getElementById('mode-btn-advanced');
    if (modeBtnBasic) {
      modeBtnBasic.addEventListener('click', () => {
        stateManager.updateState({ mode: 'basic' });
        localStorage.setItem('ai_calc_mode', 'basic');
      });
    }
    if (modeBtnAdvanced) {
      modeBtnAdvanced.addEventListener('click', () => {
        stateManager.updateState({ mode: 'advanced' });
        localStorage.setItem('ai_calc_mode', 'advanced');
      });
    }

    // Preset Category Filter Bar Click
    const presetsFilterBar = document.getElementById('presets-filter-bar');
    if (presetsFilterBar) {
      presetsFilterBar.addEventListener('click', (e) => {
        const filterBtn = e.target.closest('.filter-pill');
        if (filterBtn) {
          const category = filterBtn.getAttribute('data-category');
          if (category) {
            stateManager.updateState({ activePresetCategory: category });
          }
        }
      });
    }

    // Mobile Sidebar Collapsible Toggle
    const handleSidebarToggle = () => {
      if (!this.elements.configSidebar) return;
      const isCollapsed = this.elements.configSidebar.classList.toggle('mobile-collapsed');
      const isExpanded = !isCollapsed;
      if (this.elements.sidebarMobileToggle) {
        this.elements.sidebarMobileToggle.setAttribute('aria-expanded', String(isExpanded));
      }
      if (this.elements.toggleActionLabel) {
        this.elements.toggleActionLabel.textContent = isExpanded ? t('configToggleClose') : t('configToggleOpen');
      }
    };

    if (this.elements.sidebarMobileToggle) {
      this.elements.sidebarMobileToggle.addEventListener('click', () => {
        handleSidebarToggle();
      });
      this.elements.sidebarMobileToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSidebarToggle();
        }
      });
    }

    // Tab Navigation - Delegated click handler for robust mobile & desktop responsiveness
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.nav-tab-btn');
      if (tabBtn) {
        e.preventDefault();
        const tabId = tabBtn.getAttribute('data-tab');
        if (tabId) {
          this.switchTab(tabId);
        }
      }
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

    // Model Select Change Handler
    const handleModelChange = (e) => {
      const modelId = e.target.value;
      if (!modelId) return;
      const selectedModel = MODEL_CATALOG.find(m => m.id === modelId);
      const updates = { modelId, activePresetId: null };
      if (selectedModel && selectedModel.recommendedQuant) {
        updates.quantId = selectedModel.recommendedQuant.toLowerCase();
      }
      stateManager.updateState(updates);
    };

    // Model Select (Advanced)
    if (this.elements.modelSelect) {
      this.elements.modelSelect.addEventListener('change', handleModelChange);
      this.elements.modelSelect.addEventListener('input', handleModelChange);
    }

    // Model Select (Basic)
    if (this.elements.basicModelSelect) {
      this.elements.basicModelSelect.addEventListener('change', handleModelChange);
      this.elements.basicModelSelect.addEventListener('input', handleModelChange);
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
      const handleQuantChange = (e) => {
        stateManager.updateState({ quantId: e.target.value, activePresetId: null });
      };
      this.elements.quantSelect.addEventListener('change', handleQuantChange);
      this.elements.quantSelect.addEventListener('input', handleQuantChange);
    }

    // KV Cache Select
    if (this.elements.kvQuantSelect) {
      const handleKvQuantChange = (e) => {
        stateManager.updateState({ kvQuantId: e.target.value, activePresetId: null });
      };
      this.elements.kvQuantSelect.addEventListener('change', handleKvQuantChange);
      this.elements.kvQuantSelect.addEventListener('input', handleKvQuantChange);
    }

    // Numeric Sliders & Inputs 2-way binding (Advanced)
    this.bindNumericPair('total-users-input', 'total-users-slider', 'totalUsers');
    this.bindNumericPair('req-user-input', 'req-user-slider', 'requestsPerUserPerDay');
    this.bindNumericPair('work-hours-input', 'work-hours-slider', 'workHours');
    this.bindNumericPair('peak-multiplier-input', 'peak-multiplier-slider', 'peakMultiplier');
    this.bindNumericPair('input-tokens-input', 'input-tokens-slider', 'inputTokens');
    this.bindNumericPair('output-tokens-input', 'output-tokens-slider', 'outputTokens');
    this.bindNumericPair('target-ttft-input', 'target-ttft-slider', 'targetTtftMs');
    this.bindNumericPair('target-tps-input', 'target-tps-slider', 'targetTpsPerStream');
    this.bindNumericPair('gpu-mem-util-input', 'gpu-mem-util-slider', 'gpuMemoryUtilization');

    // Numeric Sliders & Inputs 2-way binding (Basic)
    this.bindNumericPair('basic-users-input', 'basic-users-slider', 'totalUsers');

    // Global click delegate for GPU Table Row selection, Pills, Intensity buttons
    document.addEventListener('click', (e) => {
      // Basic Quick Pills for Users
      const pillBtn = e.target.closest('.pill-btn');
      if (pillBtn) {
        const users = Number(pillBtn.getAttribute('data-users'));
        if (users) {
          stateManager.updateState({ totalUsers: users, activePresetId: null });
        }
      }

      // Basic Daily Intensity Buttons
      const intensityBtn = e.target.closest('.intensity-btn');
      if (intensityBtn) {
        const reqs = Number(intensityBtn.getAttribute('data-reqs'));
        if (reqs) {
          stateManager.updateState({ requestsPerUserPerDay: reqs, activePresetId: null });
        }
      }

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
      const isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      if (isActive && window.innerWidth <= 768) {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
    this.elements.tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabId}`);
    });

    // On mobile / tablet viewports, ensure tab results are immediately visible
    if (window.innerWidth <= 1024) {
      if (this.elements.configSidebar && !this.elements.configSidebar.classList.contains('mobile-collapsed')) {
        this.elements.configSidebar.classList.add('mobile-collapsed');
        if (this.elements.sidebarMobileToggle) {
          this.elements.sidebarMobileToggle.setAttribute('aria-expanded', 'false');
        }
        if (this.elements.toggleActionLabel) {
          this.elements.toggleActionLabel.textContent = t('configToggleOpen');
        }
      }

      const resultsEl = document.querySelector('.results-main');
      const navEl = document.querySelector('.nav-tabs-bar');
      if (resultsEl) {
        const navHeight = navEl ? navEl.offsetHeight : 54;
        const targetY = resultsEl.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  updateStaticLabels() {
    if (this.elements.configSidebar && this.elements.toggleActionLabel) {
      const isExpanded = !this.elements.configSidebar.classList.contains('mobile-collapsed');
      this.elements.toggleActionLabel.textContent = isExpanded ? t('configToggleClose') : t('configToggleOpen');
    }
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

    // Update mobile sidebar active summary badge
    if (this.elements.sidebarActiveSummary) {
      const modelName = model ? model.name : 'LLM';
      const modeLabel = state.mode === 'basic' ? t('modeBasic') : t('modeAdvanced');
      this.elements.sidebarActiveSummary.textContent = `${Number(state.totalUsers).toLocaleString()} User • ${modelName} • ${modeLabel}`;
    }

    // Render UI components
    UIRenderer.renderAll(state, calcResult, this.elements);
  }

  initVersionChecker() {
    let currentBuildId = null;
    const banner = this.elements.updateBanner;
    const btnReload = this.elements.btnReloadApp;
    const btnDismiss = this.elements.btnDismissUpdate;

    if (btnReload) {
      btnReload.addEventListener('click', () => {
        window.location.reload(true);
      });
    }

    if (btnDismiss && banner) {
      btnDismiss.addEventListener('click', () => {
        banner.style.display = 'none';
      });
    }

    const checkVersion = async () => {
      try {
        const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !data.buildId) return;

        if (!currentBuildId) {
          currentBuildId = data.buildId;
        } else if (currentBuildId !== data.buildId) {
          if (banner) {
            banner.style.display = 'block';
          }
        }
      } catch {
        // Non-intrusive: silent catch
      }
    };

    // Initial check to register loaded build
    setTimeout(checkVersion, 2000);

    // Check on tab focus
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    });

    // Check periodically every 15 minutes
    setInterval(checkVersion, 15 * 60 * 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
