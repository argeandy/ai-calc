/**
 * Dynamic UI Renderer for AI Hardware Sizing Calculator
 * Safe DOM manipulation and 100% Bilingual (DE / EN)
 */

import { MODEL_CATALOG, QUANTIZATION_TYPES, KV_CACHE_PRECISIONS } from '../data/models.js';
import { GPU_CATALOG, CLOUD_INSTANCE_MAPPINGS } from '../data/gpus.js';
import { USECASE_PRESETS } from '../data/presets.js';
import { TcoCalculator } from '../engine/tco.js';
import { stateManager } from './state.js';
import { ExportManager } from './export.js';
import { t, getLanguage } from './i18n.js';

export class UIRenderer {
  /**
   * Main render method called whenever state changes
   */
  static renderAll(state, calcResult, containerElements) {
    this.updateStaticLabels();
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
   * Render Usecase Presets
   */
  static renderPresets(state, container) {
    if (!container) return;
    container.innerHTML = '';
    const lang = getLanguage();

    USECASE_PRESETS.forEach(preset => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `preset-card ${state.activePresetId === preset.id ? 'active' : ''}`;
      btn.setAttribute('data-preset-id', preset.id);

      const iconSpan = document.createElement('span');
      iconSpan.className = 'preset-icon';
      iconSpan.textContent = preset.icon;

      const infoDiv = document.createElement('div');
      infoDiv.className = 'preset-info';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'preset-name';
      titleDiv.textContent = (lang === 'en' && preset.nameEn) ? preset.nameEn : preset.name;

      const descDiv = document.createElement('div');
      descDiv.className = 'preset-desc';
      descDiv.textContent = (lang === 'en' && preset.descriptionEn) ? preset.descriptionEn : preset.description;

      infoDiv.appendChild(titleDiv);
      infoDiv.appendChild(descDiv);

      btn.appendChild(iconSpan);
      btn.appendChild(infoDiv);
      container.appendChild(btn);
    });
  }

  /**
   * Sync form input values with current state
   */
  static renderFormInputs(state, elements) {
    // Model Select
    if (elements.modelSelect) {
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
      elements.modelSelect.value = state.modelId;
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
      elements.quantSelect.innerHTML = '';
      QUANTIZATION_TYPES.forEach(q => {
        const opt = document.createElement('option');
        opt.value = q.id;
        opt.textContent = `${q.name} (${q.bytesPerParam} B/param) - ${q.qualityRetention}`;
        elements.quantSelect.appendChild(opt);
      });
      elements.quantSelect.value = state.quantId;
    }

    // KV Cache Select
    if (elements.kvQuantSelect) {
      elements.kvQuantSelect.innerHTML = '';
      KV_CACHE_PRECISIONS.forEach(kq => {
        const opt = document.createElement('option');
        opt.value = kq.id;
        opt.textContent = `${kq.name}`;
        elements.kvQuantSelect.appendChild(opt);
      });
      elements.kvQuantSelect.value = state.kvQuantId;
    }

    // Sync numeric fields & sliders
    const syncField = (numId, sliderId, val) => {
      const numEl = document.getElementById(numId);
      const sliderEl = document.getElementById(sliderId);
      if (numEl && document.activeElement !== numEl) numEl.value = val;
      if (sliderEl && document.activeElement !== sliderEl) sliderEl.value = val;
    };

    syncField('total-users-input', 'total-users-slider', state.totalUsers);
    syncField('req-user-input', 'req-user-slider', state.requestsPerUserPerDay);
    syncField('work-hours-input', 'work-hours-slider', state.workHours);
    syncField('peak-multiplier-input', 'peak-multiplier-slider', state.peakMultiplier);
    syncField('input-tokens-input', 'input-tokens-slider', state.inputTokens);
    syncField('output-tokens-input', 'output-tokens-slider', state.outputTokens);
    syncField('target-ttft-input', 'target-ttft-slider', state.targetTtftMs);
    syncField('target-tps-input', 'target-tps-slider', state.targetTpsPerStream);
    syncField('gpu-mem-util-input', 'gpu-mem-util-slider', state.gpuMemoryUtilization);
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
            <span>💾 ${rec.totalVramAvailableGb} GB VRAM (${rec.vramUtilizationPercent}% ${t('vramUtilization')})</span>
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
              <span class="p-label">${t('powerLabel')}</span>
              <span class="p-val">${rec.totalPowerKw.toFixed(1)} kW</span>
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

    // Full GPU Table
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'gpu-table-wrapper';

    let tableHtml = `
      <table class="gpu-matrix-table">
        <thead>
          <tr>
            <th>${t('colGpuName')}</th>
            <th>${t('colGpuCount')}</th>
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
            <small class="nodes-hint">(${rec.nodesNeeded} Node${rec.nodesNeeded > 1 ? 's' : ''})</small>
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
          <td class="col-capex">€${rec.hardwareCapex.toLocaleString()}</td>
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
    const selectedGpuRec = calcResult.gpuRecommendations.find(r => r.gpu.id === state.costParams.selectedGpuId) || calcResult.highlights.bestEnterprise;
    const tcoResult = TcoCalculator.calculateTco(calcResult, selectedGpuRec, state.costParams);
    const lang = getLanguage();

    container.innerHTML = `
      <div class="tco-header-panel">
        <div class="tco-selected-gpu">
          <h3>${t('tcoSelectedTitle')} <span class="accent-text">${selectedGpuRec.totalGpusNeeded}x ${selectedGpuRec.gpu.name}</span></h3>
          <p>${lang === 'en' 
            ? `Based on ${calcResult.traffic.totalDailyRequests.toLocaleString()} requests/day (${tcoResult.monthlyTokens.totalMillions} Million Tokens/month)`
            : `Basierend auf ${calcResult.traffic.totalDailyRequests.toLocaleString()} Anfragen/Tag (${tcoResult.monthlyTokens.totalMillions} Millionen Tokens/Monat)`
          }</p>
        </div>
        <div class="tco-gpu-switcher">
          <label for="tco-gpu-select">${t('tcoGpuSwitcherLabel')}</label>
          <select id="tco-gpu-select" class="form-select">
            ${calcResult.gpuRecommendations.map(r => `
              <option value="${r.gpu.id}" ${r.gpu.id === state.costParams.selectedGpuId ? 'selected' : ''}>
                ${r.totalGpusNeeded}x ${r.gpu.name} (€${r.hardwareCapex.toLocaleString()} Capex)
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
            <div class="tco-breakdown-row">
              <span>${t('capexTotal')}</span>
              <strong>€${tcoResult.onPrem.capexTotal.toLocaleString()}</strong>
            </div>
            <div class="tco-breakdown-row">
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
          <div class="tco-card-price">
            <strong>€${tcoResult.cloud.monthlyReserved1Yr.toLocaleString()}</strong>
            <span class="unit">${t('perMonth')}</span>
          </div>
          <div class="tco-price-per-token">€${tcoResult.cloud.costPer1kTokens1Yr.toFixed(4)} ${t('per1kTokens')}</div>
          <div class="tco-breakdown-list">
            <div class="tco-breakdown-row">
              <span>${t('cloud3Yr')}</span>
              <strong>€${tcoResult.cloud.monthlyReserved3Yr.toLocaleString()} / Mo</strong>
            </div>
            <div class="tco-breakdown-row">
              <span>${t('cloudOnDemand')}</span>
              <span>€${tcoResult.cloud.monthlyOnDemand.toLocaleString()} / Mo</span>
            </div>
            <div class="tco-breakdown-row">
              <span>Hardware-Capex:</span>
              <span><strong>${t('cloudCapexZero')}</strong></span>
            </div>
            <div class="tco-breakdown-row">
              <span>${lang === 'en' ? 'Maintenance & Power:' : 'Wartung & Strom:'}</span>
              <span>${t('cloudMaintIncluded')}</span>
            </div>
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
   * Render Cluster & Topology Tab
   */
  static renderTopologyTab(state, calcResult, container) {
    if (!container) return;
    const selectedGpuRec = calcResult.gpuRecommendations.find(r => r.gpu.id === state.costParams.selectedGpuId) || calcResult.highlights.bestEnterprise;
    const cloudMapping = CLOUD_INSTANCE_MAPPINGS[selectedGpuRec.gpu.id] || { aws: 'Custom Instance', azure: 'Custom VM', gcp: 'Custom Compute' };
    const lang = getLanguage();

    container.innerHTML = `
      <div class="topology-header">
        <h3>${t('topologyTitle')}</h3>
        <p>${lang === 'en'
          ? `Visual partitioning of <strong>${selectedGpuRec.totalGpusNeeded}x ${selectedGpuRec.gpu.name}</strong> across <strong>${selectedGpuRec.nodesNeeded} Server Node(s)</strong>`
          : `Visuelle Aufteilung von <strong>${selectedGpuRec.totalGpusNeeded}x ${selectedGpuRec.gpu.name}</strong> auf <strong>${selectedGpuRec.nodesNeeded} Server Node(s)</strong>`
        }</p>
      </div>

      <div class="topo-summary-chips">
        <div class="chip"><span>Tensor Parallelism:</span> <strong>TP = ${selectedGpuRec.tp}</strong></div>
        <div class="chip"><span>Pipeline Parallelism:</span> <strong>PP = ${selectedGpuRec.pp}</strong></div>
        <div class="chip"><span>Data Parallel Replicas:</span> <strong>DP = ${selectedGpuRec.dpReplicas}</strong></div>
        <div class="chip"><span>Interconnect:</span> <strong>${selectedGpuRec.gpu.interconnect}</strong></div>
      </div>

      <div class="cluster-nodes-visual">
        ${Array.from({ length: selectedGpuRec.nodesNeeded }).map((_, nodeIdx) => {
          const gpusInThisNode = Math.min(
            selectedGpuRec.gpu.maxPerNode || 8,
            selectedGpuRec.totalGpusNeeded - (nodeIdx * (selectedGpuRec.gpu.maxPerNode || 8))
          );
          return `
            <div class="server-node-card">
              <div class="node-header">
                <div class="node-title">
                  <span class="node-icon">🖧</span>
                  <strong>${t('serverNode')} #${nodeIdx + 1}</strong>
                </div>
                <span class="node-specs">Dual AMD EPYC / Intel Xeon + ${selectedGpuRec.gpu.interconnect.includes('NVLink') ? 'NVLink NVSwitch Mesh' : 'PCIe Gen5 Switch'}</span>
              </div>
              <div class="node-gpus-grid">
                ${Array.from({ length: gpusInThisNode }).map((_, gpuIdx) => {
                  const globalGpuNum = (nodeIdx * (selectedGpuRec.gpu.maxPerNode || 8)) + gpuIdx + 1;
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
          <div class="cloud-provider-card">
            <span class="provider-logo aws">AWS</span>
            <strong>${cloudMapping.aws}</strong>
            <span class="prov-desc">Amazon EC2 Elastic Fabric Adapter (EFA)</span>
          </div>
          <div class="cloud-provider-card">
            <span class="provider-logo azure">Azure</span>
            <strong>${cloudMapping.azure}</strong>
            <span class="prov-desc">Microsoft Azure Quantum / InfiniBand</span>
          </div>
          <div class="cloud-provider-card">
            <span class="provider-logo gcp">GCP</span>
            <strong>${cloudMapping.gcp}</strong>
            <span class="prov-desc">Google Cloud A3/G2 GPU Instance</span>
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
    const selectedGpuRec = calcResult.gpuRecommendations.find(r => r.gpu.id === state.costParams.selectedGpuId) || calcResult.highlights.bestEnterprise;
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
