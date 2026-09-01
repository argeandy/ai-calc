/**
 * Export and Sharing Utilities (Markdown ADR, JSON Config, URL Sharing, Print)
 */

export class ExportManager {
  /**
   * Generates a comprehensive Architecture Decision Record (ADR) in Markdown (DE or EN)
   */
  static generateMarkdownReport(calcResult, tcoResult, state, model, quant, kvQuant, selectedGpuRec, lang = 'de') {
    const timestamp = new Date().toISOString().split('T')[0];
    const rec = selectedGpuRec || calcResult.highlights.bestEnterprise;
    const server = rec.serverChassis;
    const isEn = lang === 'en';

    if (isEn) {
      return `# AI Hardware Sizing & Infrastructure Architecture Report
*Generated on: ${timestamp} via AI Hardware Sizing Calculator*

## 1. Executive Summary & Recommendation
- **Target Model**: ${model.name} (${model.parameters}B Parameters, ${model.isMoE ? `${model.activeParameters}B Active MoE` : 'Dense'})
- **Quantization**: Weights: ${quant.name} | KV Cache: ${kvQuant.name}
- **Recommended Compute Infrastructure**: **${rec.totalGpusNeeded}x ${rec.gpu.name}** housed in **${rec.nodesNeeded}x ${server.name}**
- **Datacenter Rack Footprint**: **${rec.totalRackUnits} RU** across **${rec.racks42uNeeded}x 42U Standard Server Rack${rec.racks42uNeeded > 1 ? 's' : ''}**
- **Server Host Specs**: ${server.hostCpu} | ${server.hostMemory} | ${server.hostStorage}
- **Parallelism Strategy**: Tensor Parallelism (TP=${rec.tp}), Pipeline Parallelism (PP=${rec.pp}), Data Parallelism Replicas (DP=${rec.dpReplicas})
- **Estimated Generation Speed**: ~**${rec.singleStreamDecodeTps} tokens/s** per stream (Est. TTFT: ~**${rec.estimatedTtftMs} ms**)
- **Turnkey On-Premises Capex**: **€${tcoResult.onPrem.capexTotal.toLocaleString()}** (GPUs: €${tcoResult.onPrem.gpuCapex.toLocaleString()} | Server Nodes: €${tcoResult.onPrem.serverNodesCapex.toLocaleString()}${tcoResult.onPrem.networkingCapex > 0 ? ` | Switching: €${tcoResult.onPrem.networkingCapex.toLocaleString()}` : ''})
- **Estimated Monthly TCO (On-Prem 3-Year)**: ~**€${tcoResult.onPrem.totalMonthlyCost.toLocaleString()} / month**

---

## 2. Workload & Traffic Profile
| Parameter | Value | Unit / Description |
| :--- | :--- | :--- |
| **Total Users** | ${calcResult.traffic.totalUsers.toLocaleString()} | Registered / Potential Users |
| **Requests / User / Day** | ${calcResult.traffic.reqPerUser} | Average queries |
| **Active Work Hours** | ${calcResult.traffic.workHours} h | Daily business hours |
| **Peak Burst Factor** | ${calcResult.traffic.peakMultiplier}x | Peak multiplier over average |
| **Average RPS** | ${calcResult.traffic.avgRps} req/s | Normal load |
| **Peak RPS** | ${calcResult.traffic.peakRps} req/s | Peak load |
| **Concurrent Active Streams** | **${calcResult.traffic.peakConcurrentStreams}** | In-flight parallel streams at peak |
| **Daily Token Volume** | ${Math.round(calcResult.traffic.totalDailyTokens / 1e6 * 100) / 100} M | Million Tokens / Day |

---

## 3. Token & Sequence Specifications
| Metric | Tokens | Description |
| :--- | :--- | :--- |
| **Input / Prompt Tokens** | ${calcResult.tokens.inputTokens} | System Prompt + User Query + RAG Context |
| **Output / Completion Tokens**| ${calcResult.tokens.outputTokens} | Model generation |
| **Total Sequence Length** | ${calcResult.tokens.seqLength} | Max context per request |
| **Target TTFT SLA** | < ${calcResult.tokens.targetTtftMs} ms | Time to First Token |
| **Target Generation Speed** | > ${calcResult.tokens.targetTpsPerStream} tokens/s | Per-user interactive streaming |

---

## 4. VRAM Breakdown & Memory Footprint
| Memory Component | Required VRAM | Percentage |
| :--- | :--- | :--- |
| **Model Weights** (${quant.name}) | **${calcResult.memory.weightsVramGb} GB** | ${Math.round((calcResult.memory.weightsVramGb / calcResult.memory.totalVramRecommendedGb) * 100)}% |
| **Active KV-Cache** (${calcResult.traffic.peakConcurrentStreams} streams @ ${kvQuant.name}) | **${calcResult.memory.peakKvCacheTotalGb} GB** | ${Math.round((calcResult.memory.peakKvCacheTotalGb / calcResult.memory.totalVramRecommendedGb) * 100)}% |
| **CUDA Runtime & Activations Buffer** | **${calcResult.memory.activationBufferGb} GB** | ${Math.round((calcResult.memory.activationBufferGb / calcResult.memory.totalVramRecommendedGb) * 100)}% |
| **Total Recommended VRAM (+ Headroom)** | **${calcResult.memory.totalVramRecommendedGb} GB** | 100% |

---

## 5. Hardware Sizing & Datacenter Rack Architecture
- **Selected GPU Model**: ${rec.gpu.name} (${rec.gpu.vram} GB ${rec.gpu.vramType}, ${rec.gpu.bandwidth} GB/s Memory Bandwidth)
- **Host Server Nodes**: ${rec.nodesNeeded}x ${server.name} (${server.vendor}, ${server.formFactor})
- **Rack Units Required**: **${rec.totalRackUnits} RU** (${rec.nodesNeeded * server.heightRu} RU Server Nodes + ${rec.networkingRu} RU ToR Switches)
- **Standard 42U Racks**: **${rec.racks42uNeeded}x 42U Server Rack${rec.racks42uNeeded > 1 ? 's' : ''}** (Power density: ~${(rec.totalPowerKw / rec.racks42uNeeded).toFixed(1)} kW / Rack)
- **Host CPUs & Memory**: ${server.hostCpu}, ${server.hostMemory}
- **Storage & Power**: ${server.hostStorage}, ${server.psu}
- **Total Power Consumption**: ~**${rec.totalPowerKw.toFixed(1)} kW**

---

## 6. Financial Analysis & Itemized Capex (TCO Comparison)
| Cost Component | On-Premises Amount | Description |
| :--- | :--- | :--- |
| **GPU Accelerators** | **€${tcoResult.onPrem.gpuCapex.toLocaleString()}** | ${rec.totalGpusNeeded}x ${rec.gpu.name} |
| **Host Server Nodes** | **€${tcoResult.onPrem.serverNodesCapex.toLocaleString()}** | ${rec.nodesNeeded}x ${server.name} |
| **Cluster Switching & Rack** | **€${tcoResult.onPrem.networkingCapex.toLocaleString()}** | 400G InfiniBand/RoCE Spine-Leaf switches |
| **Total Turnkey Capex** | **€${tcoResult.onPrem.capexTotal.toLocaleString()}** | Complete on-prem acquisition |
| **Total Monthly Cost (3-Yr)** | **€${tcoResult.onPrem.totalMonthlyCost.toLocaleString()} / mo** | Depreciation + Power + 12% Maint |

---

## 7. Serving Engine Best Practice Recommendations
1. **Serving Framework**: Use **vLLM** (PagedAttention) or **SGLang** (RadixAttention) with continuous dynamic batching.
2. **Tensor Parallelism (TP)**: Set \`--tensor-parallel-size ${rec.tp}\` inside a single NVLink domain.
3. **KV Cache Precision**: Use \`--kv-cache-dtype ${state.kvQuantId}\` to maximize concurrent request capacity.
4. **Memory Utilization**: Set \`--gpu-memory-utilization ${state.gpuMemoryUtilization}\`.
`;
    }

    // German default
    return `# AI Hardware Sizing & Infrastruktur Architektur-Bericht
*Erstellt am: ${timestamp} über den AI Hardware Sizing Calculator*

## 1. Zusammenfassung & Empfehlung
- **Ziel-Modell**: ${model.name} (${model.parameters}B Parameter, ${model.isMoE ? `${model.activeParameters}B Active MoE` : 'Dense'})
- **Quantisierung**: Gewichte: ${quant.name} | KV Cache: ${kvQuant.name}
- **Empfohlene Recheninfrastruktur**: **${rec.totalGpusNeeded}x ${rec.gpu.name}** in **${rec.nodesNeeded}x ${server.name}**
- **Datacenter Rack-Bedarf**: **${rec.totalRackUnits} HE** in **${rec.racks42uNeeded}x 42U Standard-Server-Rack${rec.racks42uNeeded > 1 ? 's' : ''}**
- **Host-Server Spezifikationen**: ${server.hostCpu} | ${server.hostMemory} | ${server.hostStorage}
- **Parallelismus-Strategie**: Tensor Parallelism (TP=${rec.tp}), Pipeline Parallelism (PP=${rec.pp}), Data Parallelism Replicas (DP=${rec.dpReplicas})
- **Geschätzte Generierungsrate**: ~**${rec.singleStreamDecodeTps} tokens/s** pro Stream (Est. TTFT: ~**${rec.estimatedTtftMs} ms**)
- **Gesamter Turnkey-Capex**: **€${tcoResult.onPrem.capexTotal.toLocaleString()}** (GPUs: €${tcoResult.onPrem.gpuCapex.toLocaleString()} | Server-Nodes: €${tcoResult.onPrem.serverNodesCapex.toLocaleString()}${tcoResult.onPrem.networkingCapex > 0 ? ` | Switching: €${tcoResult.onPrem.networkingCapex.toLocaleString()}` : ''})
- **Geschätzte monatliche TCO (On-Prem 3J)**: ~**€${tcoResult.onPrem.totalMonthlyCost.toLocaleString()} / Monat**

---

## 2. Last- & Benutzerprofil
| Parameter | Wert | Einheit / Beschreibung |
| :--- | :--- | :--- |
| **Potenzielle Benutzer** | ${calcResult.traffic.totalUsers.toLocaleString()} | Registrierte / Potenzielle User |
| **Anfragen / User / Tag** | ${calcResult.traffic.reqPerUser} | Durchschnittliche Queries |
| **Arbeitsstunden** | ${calcResult.traffic.workHours} h | Tägliche Kernarbeitszeit |
| **Spitzenlast-Faktor** | ${calcResult.traffic.peakMultiplier}x | Peak-Faktor über Durchschnitt |
| **Durchschnittl. RPS** | ${calcResult.traffic.avgRps} req/s | Normale Last |
| **Peak RPS** | ${calcResult.traffic.peakRps} req/s | Spitzenlast |
| **Parallele aktive Streams** | **${calcResult.traffic.peakConcurrentStreams}** | In-flight Streams zur Spitzenlast |
| **Tägliches Tokenvolumen** | ${Math.round(calcResult.traffic.totalDailyTokens / 1e6 * 100) / 100} M | Millionen Tokens / Tag |

---

## 3. Token- & Sequenz-Spezifikation
| Metrik | Tokens | Beschreibung |
| :--- | :--- | :--- |
| **Eingabe / Prompt Tokens** | ${calcResult.tokens.inputTokens} | System-Prompt + Query + RAG-Kontext |
| **Ausgabe / Completion Tokens**| ${calcResult.tokens.outputTokens} | Modell-Antwort |
| **Gesamte Sequenzlänge** | ${calcResult.tokens.seqLength} | Maximaler Kontext pro Request |
| **Ziel-TTFT SLA** | < ${calcResult.tokens.targetTtftMs} ms | Time to First Token |
| **Ziel-Generierungsrate** | > ${calcResult.tokens.targetTpsPerStream} tokens/s | Interaktive Streaming-Geschwindigkeit |

---

## 4. VRAM-Aufteilung & Speicherbedarf
| Speicherkomponente | Benötigter VRAM | Anteil |
| :--- | :--- | :--- |
| **Modell-Gewichte** (${quant.name}) | **${calcResult.memory.weightsVramGb} GB** | ${Math.round((calcResult.memory.weightsVramGb / calcResult.memory.totalVramRecommendedGb) * 100)}% |
| **Aktiver KV-Cache** (${calcResult.traffic.peakConcurrentStreams} Streams @ ${kvQuant.name}) | **${calcResult.memory.peakKvCacheTotalGb} GB** | ${Math.round((calcResult.memory.peakKvCacheTotalGb / calcResult.memory.totalVramRecommendedGb) * 100)}% |
| **CUDA Runtime & Activation Buffer** | **${calcResult.memory.activationBufferGb} GB** | ${Math.round((calcResult.memory.activationBufferGb / calcResult.memory.totalVramRecommendedGb) * 100)}% |
| **Empfohlener VRAM (+ Headroom)** | **${calcResult.memory.totalVramRecommendedGb} GB** | 100% |

---

## 5. Hardware-Sizing & Datacenter Rack-Architektur
- **Gewähltes GPU-Modell**: ${rec.gpu.name} (${rec.gpu.vram} GB ${rec.gpu.vramType}, ${rec.gpu.bandwidth} GB/s Speicherbandbreite)
- **Host-Server Nodes**: ${rec.nodesNeeded}x ${server.name} (${server.vendor}, ${server.formFactor})
- **Benötigte Höheneinheiten (HE)**: **${rec.totalRackUnits} HE** (${rec.nodesNeeded * server.heightRu} HE Server + ${rec.networkingRu} HE ToR-Switches)
- **Standard 42U Racks**: **${rec.racks42uNeeded}x 42U Server-Rack${rec.racks42uNeeded > 1 ? 's' : ''}** (Leistungsdichte: ~${(rec.totalPowerKw / rec.racks42uNeeded).toFixed(1)} kW / Rack)
- **Host-CPUs & Arbeitsspeicher**: ${server.hostCpu}, ${server.hostMemory}
- **NVMe-Storage & Netzteile**: ${server.hostStorage}, ${server.psu}
- **Gesamte Leistungsaufnahme**: ~**${rec.totalPowerKw.toFixed(1)} kW**

---

## 6. Finanzanalyse & Aufgeschlüsselter Capex (TCO-Vergleich)
| Kostenkomponente | Betrag (On-Premises) | Beschreibung |
| :--- | :--- | :--- |
| **GPU-Beschleuniger** | **€${tcoResult.onPrem.gpuCapex.toLocaleString()}** | ${rec.totalGpusNeeded}x ${rec.gpu.name} |
| **Host-Server Nodes** | **€${tcoResult.onPrem.serverNodesCapex.toLocaleString()}** | ${rec.nodesNeeded}x ${server.name} |
| **Cluster-Netzwerk & Switches** | **€${tcoResult.onPrem.networkingCapex.toLocaleString()}** | 400G InfiniBand/RoCE Spine-Leaf |
| **Gesamte Investitionskosten (Capex)** | **€${tcoResult.onPrem.capexTotal.toLocaleString()}** | Vollständige Turnkey-Beschaffung |
| **Gesamte monatliche Kosten (3J)** | **€${tcoResult.onPrem.totalMonthlyCost.toLocaleString()} / Mo** | Abschreibung + Strom + 12% Wartung |

---

## 7. Best-Practice Empfehlungen für Serving Engines
1. **Inferenz-Framework**: Nutze **vLLM** (PagedAttention) oder **SGLang** (RadixAttention) mit Continuous Batching.
2. **Tensor Parallelism (TP)**: Konfiguriere \`--tensor-parallel-size ${rec.tp}\` innerhalb einer NVLink-Domain.
3. **KV Cache Präzision**: Setze \`--kv-cache-dtype ${state.kvQuantId}\` für maximale Parallelität.
4. **Memory Margin**: Setze \`--gpu-memory-utilization ${state.gpuMemoryUtilization}\`.
`;
  }

  /**
   * Download JSON Configuration
   */
  static downloadJsonConfig(state, calcResult) {
    const data = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      configuration: state,
      summary: {
        totalVramRequiredGb: calcResult.memory.totalVramRecommendedGb,
        peakConcurrentStreams: calcResult.traffic.peakConcurrentStreams,
        bestEnterprise: {
          gpu: calcResult.highlights.bestEnterprise.gpu.name,
          count: calcResult.highlights.bestEnterprise.totalGpusNeeded,
          serverChassis: calcResult.highlights.bestEnterprise.serverChassis.name,
          nodes: calcResult.highlights.bestEnterprise.nodesNeeded,
          totalRackUnits: calcResult.highlights.bestEnterprise.totalRackUnits,
          racks42uNeeded: calcResult.highlights.bestEnterprise.racks42uNeeded,
          tp: calcResult.highlights.bestEnterprise.tp,
          capexTotal: calcResult.highlights.bestEnterprise.hardwareCapex
        }
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-hardware-sizing-${state.modelId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Copy Text to Clipboard with Toast Notification
   */
  static async copyToClipboard(text, successMessage = 'Kopiert!') {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast(successMessage);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast(successMessage);
      return true;
    }
  }

  /**
   * Toast notification display
   */
  static showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}
