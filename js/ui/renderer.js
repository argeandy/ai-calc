/**
 * Dynamic UI Renderer for AI Hardware Sizing Calculator
 * Safe DOM manipulation, Server Chassis & Rack Units Integration, 100% Bilingual (DE / EN)
 */

import { MODEL_CATALOG, QUANTIZATION_TYPES, KV_CACHE_PRECISIONS } from '../data/models.js?v=v1.3.1-f87346d';
import { GPU_CATALOG, CLOUD_INSTANCE_MAPPINGS } from '../data/gpus.js?v=v1.3.1-f87346d';
import { USECASE_PRESETS, PRESET_CATEGORIES } from '../data/presets.js?v=v1.3.1-f87346d';
import { TcoCalculator } from '../engine/tco.js?v=v1.3.1-f87346d';
import { stateManager } from './state.js?v=v1.3.1-f87346d';
import { ExportManager } from './export.js?v=v1.3.1-f87346d';
import { t, getLanguage } from './i18n.js?v=v1.3.1-f87346d';

export class UIRenderer {
  /**
   * Main render method called whenever state changes
   */
  static renderAll(state, calcResult, containerElements) {
    this.updateStaticLabels();
    this.renderModeSwitch(state);
    this.renderPresetFilters(state);
    this.renderPresets(state, containerElements.presetsContainer);
    this.renderFormInputs(state, containerElements);
    this.renderVramBreakdown(calcResult, containerElements.vramContainer);
    this.renderMetricsSummary(calcResult, containerElements.metricsContainer);
    this.renderGpuMatrix(state, calcResult, containerElements.gpuMatrixContainer);
    this.renderTcoTab(state, calcResult, containerElements.tcoContainer);
    this.renderTopologyTab(state, calcResult, containerElements.topologyContainer);
    this.renderExportTab(state, calcResult, containerElements.exportContainer);
  }

  /**
   * Switch between Basic and Advanced UI mode
   */
  static renderModeSwitch(state) {
    const layout = document.getElementById('calculator-layout');
    const mode = state.mode || 'basic';
    if (layout) {
      layout.setAttribute('data-calc-mode', mode);
    }

    const btnBasic = document.getElementById('mode-btn-basic');
    const btnAdvanced = document.getElementById('mode-btn-advanced');
    if (btnBasic && btnAdvanced) {
      const isBasic = mode === 'basic';
      btnBasic.classList.toggle('active', isBasic);
      btnBasic.setAttribute('aria-checked', isBasic ? 'true' : 'false');
      btnAdvanced.classList.toggle('active', !isBasic);
      btnAdvanced.setAttribute('aria-checked', !isBasic ? 'true' : 'false');
    }
  }

  /**
   * Render Category Filter Tabs for Presets
   */
  static renderPresetFilters(state) {
    const container = document.getElementById('presets-filter-bar');
    if (!container) return;
    container.innerHTML = '';
    const lang = getLanguage();
    const activeCat = state.activePresetCategory || 'all';

    PRESET_CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-pill ${activeCat === cat.id ? 'active' : ''}`;
      btn.setAttribute('data-category', cat.id);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', activeCat === cat.id ? 'true' : 'false');

      const count = cat.id === 'all'
        ? USECASE_PRESETS.length
        : USECASE_PRESETS.filter(p => p.category === cat.id).length;

      const label = (lang === 'en' && cat.nameEn) ? cat.nameEn : cat.name;
      btn.innerHTML = `<span class="filter-pill-icon">${cat.icon}</span> <span class="filter-pill-text">${label}</span> <span class="filter-pill-count">${count}</span>`;
      container.appendChild(btn);
    });
  }

  /**
   * Translate all DOM elements with [data-i18n]
   */
  static updateStaticLabels() {
    const lang = getLanguage();
    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
      langLabel.textContent = lang.toUpperCase();
    }

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });
  }

  /**
   * Render Usecase Presets (filtered by active category)
   */
  static renderPresets(state, container) {
    if (!container) return;
    container.innerHTML = '';
    const lang = getLanguage();
    const activeCat = state.activePresetCategory || 'all';

    const presetsToRender = activeCat === 'all'
      ? USECASE_PRESETS
      : USECASE_PRESETS.filter(p => p.category === activeCat);

    presetsToRender.forEach(preset => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `preset-card ${state.activePresetId === preset.id ? 'active' : ''}`;
      btn.setAttribute('data-preset-id', preset.id);

      const headerDiv = document.createElement('div');
      headerDiv.className = 'preset-card-top';

      const iconSpan = document.createElement('span');
      iconSpan.className = 'preset-icon';
      iconSpan.textContent = preset.icon;

      const tagSpan = document.createElement('span');
      tagSpan.className = 'preset-badge-model';
      // Nicely formatted short model name
      const shortModel = preset.modelId
        .replace('llama-3.3-70b', 'Llama 3.3 70B')
        .replace('llama-3.1-8b', 'Llama 3.1 8B')
        .replace('deepseek-r1', 'DeepSeek R1')
        .replace('qwen-2.5-32b', 'Qwen 32B')
        .replace('qwen-2.5-72b', 'Qwen 72B')
        .replace('qwen-2.5-14b', 'Qwen 14B')
        .replace('mistral-large-2', 'Mistral Large');
      tagSpan.textContent = shortModel;

      headerDiv.appendChild(iconSpan);
      headerDiv.appendChild(tagSpan);

      const infoDiv = document.createElement('div');
      infoDiv.className = 'preset-info';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'preset-name';
      titleDiv.textContent = (lang === 'en' && preset.nameEn) ? preset.nameEn : preset.name;

      const descDiv = document.createElement('div');
      descDiv.className = 'preset-desc';
      descDiv.textContent = (lang === 'en' && preset.descriptionEn) ? preset.descriptionEn : preset.description;

      const metaDiv = document.createElement('div');
      metaDiv.className = 'preset-metrics-summary';
      metaDiv.textContent = `👥 ${preset.totalUsers.toLocaleString()} User · ⚡ ${preset.requestsPerUserPerDay} Req/d`;

      infoDiv.appendChild(titleDiv);
      infoDiv.appendChild(descDiv);
      infoDiv.appendChild(metaDiv);

      btn.appendChild(headerDiv);
      btn.appendChild(infoDiv);
      container.appendChild(btn);
    });
  }

  /**
   * Sync form input values with current state (Both Basic & Advanced)
   */
  static renderFormInputs(state, elements) {
    const lang = getLanguage();
    const langChanged = this.currentLang !== lang;
    if (langChanged) {
      this.currentLang = lang;
    }

    // Model Select (Advanced)
    if (elements.modelSelect) {
      if (elements.modelSelect.options.length === 0 || langChanged) {
        elements.modelSelect.innerHTML = '';
        MODEL_CATALOG.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.id;
          opt.textContent = `${m.name} (${m.parameters}B${m.isMoE ? ` / ${m.activeParameters}B MoE` : ''}) - ${m.provider}`;
          elements.modelSelect.appendChild(opt);
        });
        const customOpt = document.createElement('option');
        customOpt.value = 'custom';
        customOpt.textContent = `⚙️ ${t('customModel')}`;
        elements.modelSelect.appendChild(customOpt);
      }
      elements.modelSelect.value = state.modelId;
    }

    // Model Select (Basic - simplified, clean names)
    const basicModelSelect = elements.basicModelSelect || document.getElementById('basic-model-select');
    if (basicModelSelect) {
      if (basicModelSelect.options.length === 0 || langChanged) {
        basicModelSelect.innerHTML = '';
        MODEL_CATALOG.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.id;
          opt.textContent = `${m.name} (${m.parameters}B${m.isMoE ? ' MoE' : ''}) - ${m.category}`;
          basicModelSelect.appendChild(opt);
        });
      }
      basicModelSelect.value = state.modelId;
    }

    // Custom model fields visibility
    const customSection = document.getElementById('custom-model-fields');
    if (customSection) {
      customSection.style.display = state.modelId === 'custom' ? 'grid' : 'none';
      if (state.modelId === 'custom') {
        document.getElementById('custom-params').value = state.customModel.parameters;
        document.getElementById('custom-layers').value = state.customModel.layers;
        document.getElementById('custom-kv-heads').value = state.customModel.kvHeads;
        document.getElementById('custom-hidden-size').value = state.customModel.hiddenSize;
      }
    }

    // Quantization Select
    if (elements.quantSelect) {
      if (elements.quantSelect.options.length === 0 || langChanged) {
        elements.quantSelect.innerHTML = '';
        QUANTIZATION_TYPES.forEach(q => {
          const opt = document.createElement('option');
          opt.value = q.id;
          opt.textContent = `${q.name} (${q.bytesPerParam} B/param) - ${q.qualityRetention}`;
          elements.quantSelect.appendChild(opt);
        });
      }
      elements.quantSelect.value = state.quantId;
    }

    // KV Cache Select
    if (elements.kvQuantSelect) {
      if (elements.kvQuantSelect.options.length === 0 || langChanged) {
        elements.kvQuantSelect.innerHTML = '';
        KV_CACHE_PRECISIONS.forEach(kq => {
          const opt = document.createElement('option');
          opt.value = kq.id;
          opt.textContent = `${kq.name}`;
          elements.kvQuantSelect.appendChild(opt);
        });
      }
      elements.kvQuantSelect.value = state.kvQuantId;
    }

    // Sync numeric fields & sliders
    const syncField = (numId, sliderId, val) => {
      const numEl = document.getElementById(numId);
      const sliderEl = document.getElementById(sliderId);
      if (numEl && document.activeElement !== numEl) numEl.value = val;
      if (sliderEl && document.activeElement !== sliderEl) sliderEl.value = val;
    };

    // Advanced inputs
    syncField('total-users-input', 'total-users-slider', state.totalUsers);
    syncField('req-user-input', 'req-user-slider', state.requestsPerUserPerDay);
    syncField('work-hours-input', 'work-hours-slider', state.workHours);
    syncField('peak-multiplier-input', 'peak-multiplier-slider', state.peakMultiplier);
    syncField('input-tokens-input', 'input-tokens-slider', state.inputTokens);
    syncField('output-tokens-input', 'output-tokens-slider', state.outputTokens);
    syncField('target-ttft-input', 'target-ttft-slider', state.targetTtftMs);
    syncField('target-tps-input', 'target-tps-slider', state.targetTpsPerStream);
    syncField('gpu-mem-util-input', 'gpu-mem-util-slider', state.gpuMemoryUtilization);

    // Basic inputs
    syncField('basic-users-input', 'basic-users-slider', state.totalUsers);

    // Sync basic pills
    const pillButtons = document.querySelectorAll('.pill-btn');
    pillButtons.forEach(btn => {
      const u = Number(btn.getAttribute('data-users'));
      btn.classList.toggle('active', u === state.totalUsers);
    });

    // Sync basic intensity
    const intensityButtons = document.querySelectorAll('.intensity-btn');
    intensityButtons.forEach(btn => {
      const r = Number(btn.getAttribute('data-reqs'));
      const isActive = (r === state.requestsPerUserPerDay) ||
        (r === 5 && state.requestsPerUserPerDay <= 8) ||
        (r === 20 && state.requestsPerUserPerDay > 8 && state.requestsPerUserPerDay <= 35) ||
        (r === 60 && state.requestsPerUserPerDay > 35 && state.requestsPerUserPerDay <= 100) ||
        (r === 150 && state.requestsPerUserPerDay > 100);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  /**
   * Render VRAM Breakdown Bar and Card
   */
  static renderVramBreakdown(calcResult, container) {
    if (!container) return;
    const mem = calcResult.memory;
    const totalRec = mem.totalVramRecommendedGb;

    const weightsPct = Math.min(100, Math.round((mem.weightsVramGb / totalRec) * 100));
    const kvPct = Math.min(100, Math.round((mem.peakKvCacheTotalGb / totalRec) * 100));
    const overheadPct = Math.max(0, 100 - weightsPct - kvPct);

    container.innerHTML = `
      <div class="vram-summary-header">
        <div class="vram-total-box">
          <span class="vram-total-label">${t('recomVram')}</span>
          <div class="vram-total-value">
            <strong>${mem.totalVramRecommendedGb}</strong> <span class="unit">GB</span>
          </div>
          <span class="vram-subtext">${t('vramSubtext')} (${Math.round((1 - mem.gpuMemoryUtilization) * 100)}%)</span>
        </div>
        <div class="vram-quick-tags">
          <span class="pill pill-weights">${t('modelWeightsPill')}: ${mem.weightsVramGb} GB (${weightsPct}%)</span>
          <span class="pill pill-kv">${t('kvCachePill')}: ${mem.peakKvCacheTotalGb} GB (${kvPct}%)</span>
          <span class="pill pill-overhead">${t('bufferPill')}: ${mem.activationBufferGb} GB (${overheadPct}%)</span>
        </div>
      </div>

      <div class="vram-stacked-bar" role="progressbar" aria-valuenow="${totalRec}" aria-valuemin="0" aria-valuemax="${totalRec}">
        <div class="bar-segment bar-weights" style="width: ${weightsPct}%;" title="${t('weightsVram')}: ${mem.weightsVramGb} GB">
          <span>${weightsPct >= 12 ? `${mem.weightsVramGb} GB` : ''}</span>
        </div>
        <div class="bar-segment bar-kv" style="width: ${kvPct}%;" title="${t('kvCacheVram')}: ${mem.peakKvCacheTotalGb} GB">
          <span>${kvPct >= 10 ? `${mem.peakKvCacheTotalGb} GB` : ''}</span>
        </div>
        <div class="bar-segment bar-overhead" style="width: ${overheadPct}%;" title="${t('overheadVram')}: ${mem.activationBufferGb} GB">
          <span>${overheadPct >= 8 ? `${mem.activationBufferGb} GB` : ''}</span>
        </div>
      </div>

      <div class="vram-legend-grid">
        <div class="legend-item">
          <span class="legend-dot dot-weights"></span>
          <div class="legend-info">
            <span class="legend-title">${t('weightsVram')}</span>
            <span class="legend-val">${mem.weightsVramGb} GB</span>
          </div>
        </div>
        <div class="legend-item">
          <span class="legend-dot dot-kv"></span>
          <div class="legend-info">
            <span class="legend-title">${t('kvCacheVram')}</span>
            <span class="legend-val">${mem.peakKvCacheTotalGb} GB <small>(${mem.kvPerStreamMb} MB / Stream)</small></span>
          </div>
        </div>
        <div class="legend-item">
          <span class="legend-dot dot-overhead"></span>
          <div class="legend-info">
            <span class="legend-title">${t('overheadVram')}</span>
            <span class="legend-val">${mem.activationBufferGb} GB</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Metrics summary cards
   */
  static renderMetricsSummary(calcResult, container) {
    if (!container) return;
    const tr = calcResult.traffic;
    const tok = calcResult.tokens;
    const lang = getLanguage();

    container.innerHTML = `
      <div class="metric-card">
        <div class="metric-icon">🔄</div>
        <div class="metric-body">
          <div class="metric-label">${t('concurrentStreams')}</div>
          <div class="metric-val highlight">${tr.peakConcurrentStreams} <span class="subval">(Ø ${tr.avgConcurrentStreams})</span></div>
          <div class="metric-hint">${t('concurrentStreamsHint')}</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">⚡</div>
        <div class="metric-body">
          <div class="metric-label">${t('peakRps')}</div>
          <div class="metric-val">${tr.peakRps} <span class="unit">req/s</span></div>
          <div class="metric-hint">Ø ${tr.avgRps} req/s | ${tr.totalDailyRequests.toLocaleString()} ${lang === 'en' ? 'Req/Day' : 'Req/Tag'}</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">📊</div>
        <div class="metric-body">
          <div class="metric-label">${t('peakOutputTokensSec')}</div>
          <div class="metric-val">${tr.peakOutputTokensPerSec.toLocaleString()} <span class="unit">tok/s</span></div>
          <div class="metric-hint">${t('peakOutputTokensSecHint')}: ${(tr.totalDailyTokens / 1e6).toFixed(2)} M Tok/${lang === 'en' ? 'Day' : 'Tag'}</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">⏱️</div>
        <div class="metric-body">
          <div class="metric-label">${t('estDuration')}</div>
          <div class="metric-val">${tr.estRequestDurationSec} <span class="unit">s</span></div>
          <div class="metric-hint">${t('ttftLabel')} ${tok.targetTtftMs}ms | Speed: ${tok.targetTpsPerStream} tok/s</div>
        </div>
      </div>
    `;
  }

  /**
   * Render GPU Recommendation Matrix
   */
  static renderGpuMatrix(state, calcResult, container) {
    if (!container) return;
    const recommendations = calcResult.gpuRecommendations;
    const highlights = calcResult.highlights;
    const lang = getLanguage();
    const ruUnit = lang === 'en' ? 'RU' : 'HE';

    container.innerHTML = '';

    // Highlights Header Cards
    const highlightsRow = document.createElement('div');
    highlightsRow.className = 'highlights-grid';

    const renderHighlightCard = (rec, badgeKey, badgeClass, icon) => {
      if (!rec) return '';
      return `
        <div class="highlight-card ${badgeClass}">
          <div class="highlight-badge-pill"><span class="badge-icon">${icon}</span> ${t(badgeKey)}</div>
          <div class="highlight-gpu-name">${rec.totalGpusNeeded}x ${rec.gpu.name}</div>
          <div class="highlight-specs-row">
            <span>🖥️ <strong>${rec.nodesNeeded}x ${rec.serverChassis.name}</strong></span>
            <span>📦 <strong>${rec.totalRackUnits} ${ruUnit}</strong> (${rec.racks42uNeeded}x 42U Rack${rec.racks42uNeeded > 1 ? 's' : ''}) | 💾 ${rec.totalVramAvailableGb} GB VRAM (${rec.vramUtilizationPercent}% ${t('vramUtilization')})</span>
            <span>⚡ TP=${rec.tp}${rec.pp > 1 ? `, PP=${rec.pp}` : ''}${rec.dpReplicas > 1 ? `, DP=${rec.dpReplicas}` : ''}</span>
          </div>
          <div class="highlight-perf-row">
            <div class="perf-metric">
              <span class="p-label">${t('speedPerUser')}</span>
              <span class="p-val">${rec.singleStreamDecodeTps} tok/s</span>
            </div>
            <div class="perf-metric">
              <span class="p-label">${t('ttftLabel')}</span>
              <span class="p-val">${rec.estimatedTtftMs} ms</span>
            </div>
            <div class="perf-metric">
              <span class="p-label">${t('colCapex')}:</span>
              <span class="p-val">€${rec.hardwareCapex.toLocaleString()}</span>
            </div>
          </div>
        </div>
      `;
    };

    highlightsRow.innerHTML = `
      ${renderHighlightCard(highlights.bestEnterprise, 'badgeOptimal', 'enterprise', '🏆')}
      ${renderHighlightCard(highlights.bestValue, 'badgeValue', 'value', '💡')}
      ${renderHighlightCard(highlights.bestLocal, 'badgeLocal', 'local', '💻')}
    `;
    container.appendChild(highlightsRow);

    // Mobile Table Scroll Hint
    const scrollHint = document.createElement('div');
    scrollHint.className = 'table-scroll-hint';
    scrollHint.innerHTML = `<span aria-hidden="true">⇄</span> <span>${t('tableScrollHint')}</span>`;
    container.appendChild(scrollHint);

    // Full GPU Table
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'gpu-table-wrapper';

    let tableHtml = `
      <table class="gpu-matrix-table">
        <thead>
          <tr>
            <th>${t('colGpuName')}</th>
            <th>${t('colGpuCount')}</th>
            <th>${t('colServerChassis')}</th>
            <th>${t('colRackUnits')}</th>
            <th>${t('colRacksCount')}</th>
            <th>${t('colTopology')}</th>
            <th>${t('colVramTotal')}</th>
            <th>${t('colVramUtil')}</th>
            <th>${t('colSpeed')}</th>
            <th>${t('colTtft')}</th>
            <th>${t('colPower')}</th>
            <th>${t('colCapex')}</th>
            <th>${t('colCloud')}</th>
            <th>${t('colSla')}</th>
          </tr>
        </thead>
        <tbody>
    `;

    recommendations.forEach(rec => {
      const isSelected = state.costParams.selectedGpuId === rec.gpu.id;
      const slaClass = rec.slaStatus === 'optimal' ? 'sla-optimal' : rec.slaStatus === 'acceptable' ? 'sla-acceptable' : 'sla-bottleneck';
      const slaText = rec.slaStatus === 'optimal' ? t('slaOptimal') : rec.slaStatus === 'acceptable' ? t('slaAcceptable') : t('slaBottleneck');

      tableHtml += `
        <tr class="gpu-row ${isSelected ? 'selected' : ''}" data-gpu-id="${rec.gpu.id}">
          <td class="col-gpu-name">
            <div class="gpu-name-cell">
              <strong>${rec.gpu.name}</strong>
              <span class="gpu-tier-sub">${rec.gpu.tier} (${rec.gpu.vram}GB ${rec.gpu.vramType})</span>
              <div class="gpu-tags-list">
                ${rec.gpu.badges.map(b => `<span class="micro-badge">${b}</span>`).join('')}
              </div>
            </div>
          </td>
          <td class="col-count">
            <span class="gpu-count-badge">${rec.totalGpusNeeded}x</span>
          </td>
          <td class="col-server">
            <div class="server-cell">
              <strong>${rec.nodesNeeded}x ${rec.serverChassis.name.split(' (')[0]}</strong>
              <small class="nodes-hint">${rec.serverChassis.hostCpu.split(' (')[0]}</small>
            </div>
          </td>
          <td class="col-ru">
            <span class="ru-badge"><strong>${rec.totalRackUnits}</strong> ${ruUnit}</span>
          </td>
          <td class="col-racks">
            <span class="racks-badge"><strong>${rec.racks42uNeeded}x</strong> 42U</span>
          </td>
          <td class="col-topology">
            <div class="topo-cell">
              <span class="topo-badge">TP=${rec.tp}</span>
              ${rec.pp > 1 ? `<span class="topo-badge pp">PP=${rec.pp}</span>` : ''}
              ${rec.dpReplicas > 1 ? `<span class="topo-badge dp">DP=${rec.dpReplicas}</span>` : ''}
            </div>
          </td>
          <td class="col-vram"><strong>${rec.totalVramAvailableGb}</strong> GB</td>
          <td class="col-vram-util">
            <div class="util-bar-wrapper">
              <div class="util-bar-fill ${rec.vramUtilizationPercent > 90 ? 'high' : 'normal'}" style="width: ${rec.vramUtilizationPercent}%"></div>
              <span>${rec.vramUtilizationPercent}%</span>
            </div>
          </td>
          <td class="col-tps">
            <span class="tps-val ${rec.singleStreamDecodeTps >= state.targetTpsPerStream ? 'pass' : 'warn'}">
              ${rec.singleStreamDecodeTps} tok/s
            </span>
          </td>
          <td class="col-ttft">
            <span class="ttft-val ${rec.estimatedTtftMs <= state.targetTtftMs ? 'pass' : 'warn'}">
              ${rec.estimatedTtftMs} ms
            </span>
          </td>
          <td class="col-power">${rec.totalPowerKw.toFixed(1)} kW</td>
          <td class="col-capex" title="GPUs: €${rec.gpuCapex.toLocaleString()} | Server: €${rec.serverNodesCapex.toLocaleString()}${rec.networkingCapex > 0 ? ` | Switch: €${rec.networkingCapex.toLocaleString()}` : ''}">
            <strong>€${rec.hardwareCapex.toLocaleString()}</strong>
          </td>
          <td class="col-cloud">€${Math.round(rec.cloudMonthlyReserved1Yr).toLocaleString()} <small>/Mo</small></td>
          <td class="col-sla">
            <span class="sla-badge ${slaClass}">${slaText}</span>
          </td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
    `;
    tableWrapper.innerHTML = tableHtml;
    container.appendChild(tableWrapper);
  }

  /**
   * Render TCO & Cost Comparison Tab
   */
  static renderTcoTab(state, calcResult, container) {
    if (!container) return;
    const lang = getLanguage();
    const ruUnit = lang === 'en' ? 'RU' : 'HE';
    const selectedGpuRec = calcResult.gpuRecommendations.find(r => r.gpu.id === state.costParams.selectedGpuId) || calcResult.highlights.bestEnterprise || calcResult.gpuRecommendations[0];
    const tcoResult = TcoCalculator.calculateTco(calcResult, selectedGpuRec, state.costParams);
    const cloudMapping = CLOUD_INSTANCE_MAPPINGS[selectedGpuRec.gpu.id];
    const azureInfo = cloudMapping && cloudMapping.azure ? cloudMapping.azure : null;

    container.innerHTML = `
      <div class="tco-header-panel">
        <div class="tco-selected-gpu">
          <h3>${t('tcoSelectedTitle')} <span class="accent-text">${selectedGpuRec.totalGpusNeeded}x ${selectedGpuRec.gpu.name}</span> in <span class="accent-text">${selectedGpuRec.nodesNeeded}x ${selectedGpuRec.serverChassis.name}</span></h3>
          <p>${lang === 'en' 
            ? `Based on ${calcResult.traffic.totalDailyRequests.toLocaleString()} requests/day (${tcoResult.monthlyTokens.totalMillions} Million Tokens/month) • ${selectedGpuRec.totalRackUnits} ${ruUnit} in ${selectedGpuRec.racks42uNeeded}x 42U Rack`
            : `Basierend auf ${calcResult.traffic.totalDailyRequests.toLocaleString()} Anfragen/Tag (${tcoResult.monthlyTokens.totalMillions} Millionen Tokens/Monat) • ${selectedGpuRec.totalRackUnits} ${ruUnit} in ${selectedGpuRec.racks42uNeeded}x 42U Rack`
          }</p>
        </div>
        <div class="tco-gpu-switcher">
          <label for="tco-gpu-select">${t('tcoGpuSwitcherLabel')}</label>
          <select id="tco-gpu-select" class="form-select">
            ${calcResult.gpuRecommendations.map(r => `
              <option value="${r.gpu.id}" ${r.gpu.id === state.costParams.selectedGpuId ? 'selected' : ''}>
                ${r.totalGpusNeeded}x ${r.gpu.name} in ${r.nodesNeeded}x ${r.serverChassis.name.split(' (')[0]} (${r.totalRackUnits} ${ruUnit}, Capex: €${r.hardwareCapex.toLocaleString()})
              </option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="tco-cost-sliders-grid">
        <div class="cost-param-item">
          <label>${t('sliderElectricity')} <strong id="val-electricity">${state.costParams.electricityKwhCost}</strong> €</label>
          <input type="range" id="slider-electricity" min="0.08" max="0.50" step="0.01" value="${state.costParams.electricityKwhCost}">
        </div>
        <div class="cost-param-item">
          <label>${t('sliderPue')} <strong id="val-pue">${state.costParams.pueFactor}</strong></label>
          <input type="range" id="slider-pue" min="1.10" max="1.80" step="0.05" value="${state.costParams.pueFactor}">
        </div>
        <div class="cost-param-item">
          <label>${t('sliderAmortization')} <strong id="val-amortization">${state.costParams.hardwareAmortizationYears}</strong> ${t('years')}</label>
          <input type="range" id="slider-amortization" min="1" max="5" step="1" value="${state.costParams.hardwareAmortizationYears}">
        </div>
      </div>

      <div class="tco-cards-comparison-grid">
        <!-- On Prem Card -->
        <div class="tco-card onprem-card">
          <div class="tco-card-badge">${t('onPremBadge')}</div>
          <div class="tco-card-price">
            <strong>€${tcoResult.onPrem.totalMonthlyCost.toLocaleString()}</strong>
            <span class="unit">${t('perMonth')}</span>
          </div>
          <div class="tco-price-per-token">€${tcoResult.onPrem.costPer1kTokens.toFixed(4)} ${t('per1kTokens')}</div>
          <div class="tco-breakdown-list">
            <div class="tco-breakdown-row highlight-row">
              <span>${t('capexTotal')}</span>
              <strong>€${tcoResult.onPrem.capexTotal.toLocaleString()}</strong>
            </div>
            <div class="tco-sub-item">
              <span>${t('gpuCapexItem')} (${selectedGpuRec.totalGpusNeeded}x ${selectedGpuRec.gpu.name}):</span>
              <span>€${tcoResult.onPrem.gpuCapex.toLocaleString()}</span>
            </div>
            <div class="tco-sub-item">
              <span>${t('serverCapexItem')} (${selectedGpuRec.nodesNeeded}x ${selectedGpuRec.serverChassis.name.split(' (')[0]}):</span>
              <span>€${tcoResult.onPrem.serverNodesCapex.toLocaleString()}</span>
            </div>
            ${tcoResult.onPrem.networkingCapex > 0 ? `
              <div class="tco-sub-item">
                <span>${t('networkCapexItem')}</span>
                <span>€${tcoResult.onPrem.networkingCapex.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="tco-breakdown-row" style="margin-top: 0.5rem;">
              <span>${t('monthlyDeprec')} (${state.costParams.hardwareAmortizationYears}${lang === 'en' ? 'Yr' : 'J'}):</span>
              <span>€${tcoResult.onPrem.monthlyDepreciation.toLocaleString()} / Mo</span>
            </div>
            <div class="tco-breakdown-row">
              <span>${t('monthlyElectricity')} (${tcoResult.onPrem.effectiveMonthlyKwh.toLocaleString()} kWh):</span>
              <span>€${tcoResult.onPrem.monthlyElectricityCost.toLocaleString()} / Mo</span>
            </div>
            <div class="tco-breakdown-row">
              <span>${t('monthlyMaint')}</span>
              <span>€${tcoResult.onPrem.monthlyMaintenanceCost.toLocaleString()} / Mo</span>
            </div>
          </div>
        </div>

        <!-- Cloud Reserved Card -->
        <div class="tco-card cloud-card">
          <div class="tco-card-badge">${t('cloudBadge')}</div>
          ${azureInfo && azureInfo.sku ? `
            <div class="azure-sku-badge">
              <span>☁️ Azure:</span>
              <code>${azureInfo.sku}</code>
            </div>
          ` : ''}
          <div class="tco-card-price">
            <strong>€${tcoResult.cloud.monthlyReserved1Yr.toLocaleString()}</strong>
            <span class="unit">${t('perMonth')}</span>
          </div>
          <div class="tco-price-per-token">€${tcoResult.cloud.costPer1kTokens1Yr.toFixed(4)} ${t('per1kTokens')}</div>
          <div class="tco-breakdown-list">
            <div class="tco-breakdown-row highlight-row">
              <span>${t('cloud1Yr')}</span>
              <strong>€${tcoResult.cloud.monthlyReserved1Yr.toLocaleString()} / Mo</strong>
            </div>
            <div class="tco-breakdown-row">
              <span>${t('cloud3Yr')}</span>
              <strong>€${tcoResult.cloud.monthlyReserved3Yr.toLocaleString()} / Mo</strong>
            </div>
            <div class="tco-breakdown-row">
              <span>${t('cloudOnDemand')}</span>
              <span>€${tcoResult.cloud.monthlyOnDemand.toLocaleString()} / Mo</span>
            </div>
            ${azureInfo && azureInfo.hourly1Yr ? `
              <div class="tco-sub-item" style="margin-top: 0.35rem;">
                <span>${t('azureNodeRate')}</span>
                <span>$${azureInfo.hourly1Yr.toFixed(2)} / h (${azureInfo.name || 'Azure VM'})</span>
              </div>
            ` : ''}
            <div class="tco-breakdown-row" style="margin-top: 0.5rem;">
              <span>Hardware-Capex:</span>
              <span><strong>${t('cloudCapexZero')}</strong></span>
            </div>
            <div class="tco-breakdown-row">
              <span>${lang === 'en' ? 'Maintenance & Power:' : 'Wartung & Strom:'}</span>
              <span>${t('cloudMaintIncluded')}</span>
            </div>
          </div>
          <div class="azure-pricing-note">
            <span>💡 ${t('azurePricingNote')}</span>
          </div>
        </div>
      </div>

      <div class="tco-api-comparison-section">
        <h3>${t('apiComparisonTitle')}</h3>
        <p class="section-desc">${lang === 'en' 
          ? `What would this token volume (${tcoResult.monthlyTokens.totalMillions}M Tokens/month) cost with commercial API providers?`
          : `Was würde dieses Token-Volumen (${tcoResult.monthlyTokens.totalMillions} Mio Tokens/Monat) bei externen API-Anbietern kosten?`
        }</p>
        
        <div class="api-cards-grid">
          ${tcoResult.apis.map(api => `
            <div class="api-card">
              <div class="api-card-header">
                <strong>${api.name}</strong>
                <span class="api-rates">$${api.inputPricePerMillion} in / $${api.outputPricePerMillion} out</span>
              </div>
              <div class="api-total-monthly">
                <strong>€${api.monthlyTotalCost.toLocaleString()}</strong> <small>${t('perMonth')}</small>
              </div>
              <div class="api-breakeven">
                ${api.breakEvenMonths ? `
                  <span class="breakeven-pill success">
                    ✅ ${t('amortizationAfter')} <strong>${api.breakEvenMonths} ${t('months')}</strong>
                  </span>
                ` : `
                  <span class="breakeven-pill neutral">${t('apiCheaperAtLowVolume')}</span>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render Cluster & Topology Tab with Rack Allocation
   */
  static renderTopologyTab(state, calcResult, container) {
    if (!container) return;
    const selectedGpuRec = calcResult.gpuRecommendations.find(r => r.gpu.id === state.costParams.selectedGpuId) || calcResult.highlights.bestEnterprise || calcResult.gpuRecommendations[0];
    const serverChassis = selectedGpuRec.serverChassis;
    const cloudMapping = CLOUD_INSTANCE_MAPPINGS[selectedGpuRec.gpu.id] || { aws: 'Custom Instance', azure: 'Custom VM', gcp: 'Custom Compute' };
    const lang = getLanguage();
    const ruUnit = lang === 'en' ? 'RU' : 'HE';

    container.innerHTML = `
      <div class="topology-header">
        <h3>${t('topologyTitle')}</h3>
        <p>${lang === 'en'
          ? `Visual partitioning of <strong>${selectedGpuRec.totalGpusNeeded}x ${selectedGpuRec.gpu.name}</strong> across <strong>${selectedGpuRec.nodesNeeded}x ${serverChassis.name}</strong>`
          : `Visuelle Aufteilung von <strong>${selectedGpuRec.totalGpusNeeded}x ${selectedGpuRec.gpu.name}</strong> auf <strong>${selectedGpuRec.nodesNeeded}x ${serverChassis.name}</strong>`
        }</p>
      </div>

      <div class="topo-summary-chips">
        <div class="chip"><span>Server Chassis:</span> <strong>${serverChassis.vendor} (${serverChassis.formFactor})</strong></div>
        <div class="chip"><span>${t('rackUnitsLabel')}</span> <strong>${selectedGpuRec.totalRackUnits} ${ruUnit} (${selectedGpuRec.racks42uNeeded}x 42U Rack${selectedGpuRec.racks42uNeeded > 1 ? 's' : ''})</strong></div>
        <div class="chip"><span>Tensor Parallelism:</span> <strong>TP = ${selectedGpuRec.tp}</strong></div>
        <div class="chip"><span>Pipeline Parallelism:</span> <strong>PP = ${selectedGpuRec.pp}</strong></div>
        <div class="chip"><span>Data Parallel Replicas:</span> <strong>DP = ${selectedGpuRec.dpReplicas}</strong></div>
        <div class="chip"><span>Interconnect:</span> <strong>${selectedGpuRec.gpu.interconnect}</strong></div>
      </div>

      <!-- Datacenter Rack Allocation Visualizer -->
      <div class="rack-allocation-card">
        <div class="rack-card-header">
          <h4>📦 ${t('rackAllocationTitle')}</h4>
          <span class="rack-badge-counter"><strong>${selectedGpuRec.racks42uNeeded}x</strong> 42U Server Rack${selectedGpuRec.racks42uNeeded > 1 ? 's' : ''} (${selectedGpuRec.totalRackUnits} ${ruUnit} Total)</span>
        </div>
        <div class="rack-visualizer-row">
          ${Array.from({ length: selectedGpuRec.racks42uNeeded }).map((_, rackIdx) => {
            const freeRu = Math.max(0, 42 - (selectedGpuRec.totalRackUnits / selectedGpuRec.racks42uNeeded));
            return `
              <div class="rack-frame">
                <div class="rack-header-label">Rack #${rackIdx + 1} (42U Standard)</div>
                <div class="rack-slot-stack">
                  <div class="rack-slot tor-slot">
                    <span>Top-of-Rack 400G Spine/Leaf Switch (1U-2U)</span>
                  </div>
                  ${Array.from({ length: Math.ceil(selectedGpuRec.nodesNeeded / selectedGpuRec.racks42uNeeded) }).map((__, nodeInRackIdx) => `
                    <div class="rack-slot server-slot">
                      <strong>${serverChassis.name.split(' (')[0]}</strong>
                      <span class="slot-ru-tag">${serverChassis.heightRu} ${ruUnit}</span>
                    </div>
                  `).join('')}
                  <div class="rack-slot free-slot">
                    <span>${Math.round(freeRu)} ${ruUnit} ${lang === 'en' ? 'Available Headroom / Cable Space' : 'Freier Platz / Reserve & PDU'}</span>
                  </div>
                </div>
                <div class="rack-footer-power">
                  <span>⚡ ${lang === 'en' ? 'Power Load:' : 'Leistungsaufnahme:'} ~${(selectedGpuRec.totalPowerKw / selectedGpuRec.racks42uNeeded).toFixed(1)} kW / 25 kW Max</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="cluster-nodes-visual">
        ${Array.from({ length: selectedGpuRec.nodesNeeded }).map((_, nodeIdx) => {
          const maxGpus = selectedGpuRec.gpu.maxPerNode || serverChassis.maxGpus || 8;
          const gpusInThisNode = Math.min(
            maxGpus,
            selectedGpuRec.totalGpusNeeded - (nodeIdx * maxGpus)
          );
          return `
            <div class="server-node-card">
              <div class="node-header">
                <div class="node-title">
                  <span class="node-icon">🖥️</span>
                  <strong>${serverChassis.name} - Node #${nodeIdx + 1}</strong>
                </div>
                <div class="server-chassis-specs-badge">
                  <span>${serverChassis.vendor}</span> • <span>${serverChassis.formFactor}</span> • <span>${serverChassis.heightRu} ${ruUnit}</span>
                </div>
              </div>

              <!-- Host Specifications Bar -->
              <div class="node-host-specs-grid">
                <div class="host-spec-item">
                  <span class="spec-label">${t('hostCpuLabel')}</span>
                  <span class="spec-value">${serverChassis.hostCpu}</span>
                </div>
                <div class="host-spec-item">
                  <span class="spec-label">${t('hostMemoryLabel')}</span>
                  <span class="spec-value">${serverChassis.hostMemory}</span>
                </div>
                <div class="host-spec-item">
                  <span class="spec-label">${t('hostStorageLabel')}</span>
                  <span class="spec-value">${serverChassis.hostStorage}</span>
                </div>
                <div class="host-spec-item">
                  <span class="spec-label">${t('hostNetworkingLabel')}</span>
                  <span class="spec-value">${serverChassis.networking}</span>
                </div>
                <div class="host-spec-item">
                  <span class="spec-label">${t('hostPsuLabel')}</span>
                  <span class="spec-value">${serverChassis.psu}</span>
                </div>
              </div>

              <!-- GPU Bay Visual -->
              <div class="node-gpus-grid" style="margin-top: 1rem;">
                ${Array.from({ length: gpusInThisNode }).map((_, gpuIdx) => {
                  const globalGpuNum = (nodeIdx * maxGpus) + gpuIdx + 1;
                  return `
                    <div class="gpu-die-box">
                      <div class="die-header">
                        <span class="gpu-label">GPU #${globalGpuNum}</span>
                        <span class="gpu-vram-tag">${selectedGpuRec.gpu.vram} GB</span>
                      </div>
                      <div class="die-body">
                        <div class="die-model">${selectedGpuRec.gpu.name}</div>
                        <div class="die-speed">${selectedGpuRec.gpu.bandwidth} GB/s ${selectedGpuRec.gpu.vramType}</div>
                      </div>
                      <div class="die-footer">
                        <span class="tp-tag">Rank #${gpuIdx % selectedGpuRec.tp}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="cloud-instances-section">
        <h4>${t('cloudInstancesTitle')}</h4>
        <div class="cloud-cards-row">
          <!-- AWS Card -->
          <div class="cloud-provider-card">
            <div class="provider-card-header">
              <span class="provider-logo aws">AWS</span>
            </div>
            <strong class="cloud-instance-title">${cloudMapping.aws?.name || cloudMapping.aws || 'EC2 Instance'}</strong>
            <span class="prov-specs">Amazon EC2 Elastic Fabric Adapter (EFA)</span>
            ${cloudMapping.aws?.hourly1Yr ? `
              <div class="cloud-price-tags">
                <span class="price-tag-item">1-Yr: <strong>$${cloudMapping.aws.hourly1Yr.toFixed(2)}/h</strong></span>
                <span class="price-tag-item on-demand">PayGo: <strong>$${cloudMapping.aws.hourlyOnDemand.toFixed(2)}/h</strong></span>
              </div>
            ` : ''}
          </div>

          <!-- Azure Card (Enhanced with Real Azure SKU & Pricing) -->
          <div class="cloud-provider-card azure-highlight-card">
            <div class="provider-card-header">
              <span class="provider-logo azure">Azure</span>
              <span class="cloud-sku-pill">${cloudMapping.azure?.sku || 'Azure VM'}</span>
            </div>
            <strong class="cloud-instance-title">${cloudMapping.azure?.name || cloudMapping.azure || 'Azure VM'}</strong>
            <span class="prov-specs">${cloudMapping.azure?.specs || 'Microsoft Azure Quantum-2 / InfiniBand'}</span>
            ${cloudMapping.azure?.hourly1Yr ? `
              <div class="cloud-price-tags">
                <span class="price-tag-item">1-Yr: <strong>$${cloudMapping.azure.hourly1Yr.toFixed(2)}/h</strong></span>
                <span class="price-tag-item">3-Yr: <strong>$${cloudMapping.azure.hourly3Yr.toFixed(2)}/h</strong></span>
                <span class="price-tag-item on-demand">PayGo: <strong>$${cloudMapping.azure.hourlyOnDemand.toFixed(2)}/h</strong></span>
              </div>
              <div class="cloud-cluster-est">
                <span>${lang === 'en' ? 'Cluster Total:' : 'Cluster-Gesamt:'} <strong>${selectedGpuRec.nodesNeeded}x VM (~€${Math.round(selectedGpuRec.cloudMonthlyReserved1Yr).toLocaleString()} / Mo)</strong></span>
              </div>
            ` : ''}
          </div>

          <!-- GCP Card -->
          <div class="cloud-provider-card">
            <div class="provider-card-header">
              <span class="provider-logo gcp">GCP</span>
            </div>
            <strong class="cloud-instance-title">${cloudMapping.gcp?.name || cloudMapping.gcp || 'GCP Compute Engine'}</strong>
            <span class="prov-specs">Google Cloud A3/G2 GPU Instance with Hyperdisk</span>
            ${cloudMapping.gcp?.hourly1Yr ? `
              <div class="cloud-price-tags">
                <span class="price-tag-item">1-Yr: <strong>$${cloudMapping.gcp.hourly1Yr.toFixed(2)}/h</strong></span>
                <span class="price-tag-item on-demand">PayGo: <strong>$${cloudMapping.gcp.hourlyOnDemand.toFixed(2)}/h</strong></span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Export & ADR Report Tab
   */
  static renderExportTab(state, calcResult, container) {
    if (!container) return;
    const model = stateManager.getSelectedModel();
    const quant = stateManager.getSelectedQuant();
    const kvQuant = stateManager.getSelectedKvQuant();
    const selectedGpuRec = calcResult.gpuRecommendations.find(r => r.gpu.id === state.costParams.selectedGpuId) || calcResult.highlights.bestEnterprise || calcResult.gpuRecommendations[0];
    const tcoResult = TcoCalculator.calculateTco(calcResult, selectedGpuRec, state.costParams);
    const lang = getLanguage();

    const markdownText = ExportManager.generateMarkdownReport(
      calcResult,
      tcoResult,
      state,
      model,
      quant,
      kvQuant,
      selectedGpuRec,
      lang
    );

    container.innerHTML = `
      <div class="export-header-panel">
        <div>
          <h3>${t('exportTitle')}</h3>
          <p>${t('exportDesc')}</p>
        </div>
        <div class="export-actions-row">
          <button type="button" class="btn btn-primary" id="btn-copy-markdown">
            📋 ${t('copyMarkdown')}
          </button>
          <button type="button" class="btn btn-secondary" id="btn-download-json">
            💾 ${t('downloadJson')}
          </button>
          <button type="button" class="btn btn-outline" id="btn-share-link">
            🔗 ${t('shareUrl')}
          </button>
          <button type="button" class="btn btn-outline" id="btn-print-report">
            🖨️ ${t('printReport')}
          </button>
        </div>
      </div>

      <div class="markdown-preview-box">
        <div class="preview-bar">
          <span>Markdown Architecture Decision Record (ADR) [${lang.toUpperCase()}]</span>
          <button type="button" class="btn-micro" id="btn-copy-markdown-inline">${lang === 'en' ? 'Copy' : 'Kopieren'}</button>
        </div>
        <pre class="markdown-code"><code>${this.escapeHtml(markdownText)}</code></pre>
      </div>
    `;
  }

  /**
   * Safe HTML escaping helper
   */
  static escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
