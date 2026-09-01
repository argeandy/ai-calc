/**
 * AI Hardware Sizing and Compute Calculation Engine
 */
import { SERVER_CHASSIS_CATALOG } from '../data/servers.js';

export class HardwareCalculator {
  /**
   * Main calculation function
   * @param {Object} input - User inputs & configuration
   * @param {Object} model - Selected model metadata
   * @param {Object} quant - Selected model quantization
   * @param {Object} kvQuant - Selected KV Cache quantization
   * @param {Array} gpuCatalog - List of available GPUs
   * @returns {Object} Full calculation results and sizing recommendations
   */
  static calculate(input, model, quant, kvQuant, gpuCatalog) {
    // 1. Traffic & Request Rate Calculations
    const totalUsers = Math.max(1, Number(input.totalUsers) || 100);
    const reqPerUser = Math.max(0.1, Number(input.requestsPerUserPerDay) || 20);
    const peakMultiplier = Math.max(1.0, Number(input.peakMultiplier) || 2.0);
    const workHours = Math.max(1, Number(input.workHours) || 8);
    const inputTokens = Math.max(1, Number(input.inputTokens) || 2000);
    const outputTokens = Math.max(1, Number(input.outputTokens) || 300);
    const targetTtftMs = Math.max(50, Number(input.targetTtftMs) || 500);
    const targetTpsPerStream = Math.max(5, Number(input.targetTpsPerStream) || 30);
    const gpuMemoryUtilization = Math.min(0.95, Math.max(0.70, Number(input.gpuMemoryUtilization) || 0.90));

    const totalDailyRequests = Math.round(totalUsers * reqPerUser);
    const activeSecondsPerDay = workHours * 3600;
    const avgRps = totalDailyRequests / activeSecondsPerDay;
    const peakRps = avgRps * peakMultiplier;

    // Latency & In-Flight Stream Calculation
    const estRequestDurationSec = (targetTtftMs / 1000) + (outputTokens / targetTpsPerStream);
    // Little's Law: L = lambda * W
    const avgConcurrentStreams = Math.max(1, Math.ceil(avgRps * estRequestDurationSec));
    const peakConcurrentStreams = Math.max(1, Math.ceil(peakRps * estRequestDurationSec));

    // Token Throughput Rates
    const tokensPerRequest = inputTokens + outputTokens;
    const totalDailyTokens = totalDailyRequests * tokensPerRequest;
    const peakInputTokensPerSec = peakRps * inputTokens;
    const peakOutputTokensPerSec = peakRps * outputTokens;
    const peakTotalTokensPerSec = peakRps * tokensPerRequest;

    // 2. Memory (VRAM) Breakdown
    // A. Model Weights Memory
    const totalParamsBillion = model.parameters;
    const activeParamsBillion = model.activeParameters || model.parameters;
    const bytesPerParam = quant.bytesPerParam;
    const weightsVramRawGb = (totalParamsBillion * 1e9 * bytesPerParam) / (1024 ** 3);
    const weightsVramGb = weightsVramRawGb * quant.overheadFactor;

    // B. KV Cache Memory per Token
    const layers = model.layers || 32;
    const kvBytes = kvQuant.bytesPerElement || 2.0;
    let bytesPerToken = 0;

    if (model.id === 'deepseek-v3' || model.id === 'deepseek-r1') {
      // DeepSeek MLA (Multi-Head Latent Attention): Compressed KV vector + Decoupled RoPE vector
      bytesPerToken = layers * 576 * kvBytes;
    } else {
      // Standard GQA / MHA
      const kvHeads = model.kvHeads || (model.attentionHeads / 4);
      const headDim = model.headDim || (model.hiddenSize / model.attentionHeads);
      bytesPerToken = 2 * layers * kvHeads * headDim * kvBytes;
    }

    const kvBytesPerTokenGb = bytesPerToken / (1024 ** 3);
    const seqLength = inputTokens + outputTokens;
    const kvPerStreamGb = kvBytesPerTokenGb * seqLength;

    // PagedAttention fragmentation overhead (~5%)
    const pagedAttentionOverhead = 1.05;
    const peakKvCacheTotalGb = peakConcurrentStreams * kvPerStreamGb * pagedAttentionOverhead;
    const avgKvCacheTotalGb = avgConcurrentStreams * kvPerStreamGb * pagedAttentionOverhead;

    // C. Activation & Framework Buffer
    const activationBufferGb = Math.max(2.0, weightsVramGb * 0.06 + (peakConcurrentStreams * 0.05));

    // D. Total Required VRAM
    const totalVramRequiredRawGb = weightsVramGb + peakKvCacheTotalGb + activationBufferGb;
    const totalVramRecommendedGb = totalVramRequiredRawGb / gpuMemoryUtilization;

    // 3. GPU & Server Sizing for each GPU Option
    const gpuRecommendations = gpuCatalog.map(gpu => {
      // Look up associated server chassis model
      const serverChassis = SERVER_CHASSIS_CATALOG.find(s => s.id === gpu.serverChassisId) || SERVER_CHASSIS_CATALOG[0];

      // Minimum GPUs to fit total VRAM
      let minGpusForVram = Math.ceil(totalVramRecommendedGb / gpu.vram);
      
      // Enforce realistic Tensor Parallelism (TP) constraints
      let tp = 1;
      if (minGpusForVram <= 1) tp = 1;
      else if (minGpusForVram <= 2) tp = 2;
      else if (minGpusForVram <= 4) tp = 4;
      else if (minGpusForVram <= 8) tp = 8;
      else {
        tp = 8;
      }

      let pp = 1;
      if (minGpusForVram > 8) {
        pp = Math.ceil(minGpusForVram / 8);
      }

      let gpusPerInstance = tp * pp;

      // Bandwidth & Token Generation Speed Estimate
      const activeWeightsGb = (activeParamsBillion * 1e9 * bytesPerParam) / (1024 ** 3);
      let interconnectEfficiency = 0.95;
      if (gpu.interconnect.includes('PCIe') && tp > 1) {
        interconnectEfficiency = Math.max(0.70, 0.92 - (tp * 0.04));
      } else if (gpu.id.includes('apple')) {
        interconnectEfficiency = 0.90;
      }

      const aggregateBandwidthGbS = gpusPerInstance * gpu.bandwidth * interconnectEfficiency;
      const singleStreamDecodeTps = Math.round(aggregateBandwidthGbS / Math.max(1, activeWeightsGb));

      // Prefill Time (TTFT) estimation:
      const effectiveTflops = gpusPerInstance * (quant.id === 'fp8' ? gpu.fp8Tflops : gpu.fp16Tflops) * 0.42;
      const prefillFlopsRequired = 2 * (activeParamsBillion * 1e9) * inputTokens;
      const prefillTimeSec = prefillFlopsRequired / (effectiveTflops * 1e12);
      const estimatedTtftMs = Math.round(prefillTimeSec * 1000 + 20);

      // Max Batch Size & Cluster Throughput
      const maxBatchThroughputTps = Math.round(
        Math.min(
          singleStreamDecodeTps * Math.min(peakConcurrentStreams, 48),
          (effectiveTflops * 1e12) / (2 * activeParamsBillion * 1e9) * 0.8
        )
      );

      let dpReplicas = 1;
      if (maxBatchThroughputTps < peakOutputTokensPerSec) {
        dpReplicas = Math.ceil(peakOutputTokensPerSec / Math.max(1, maxBatchThroughputTps));
      }

      const totalGpusNeeded = gpusPerInstance * dpReplicas;
      const maxGpusPerNode = gpu.maxPerNode || serverChassis.maxGpus || 8;
      const nodesNeeded = Math.ceil(totalGpusNeeded / maxGpusPerNode);

      // Power and TDP
      const totalGpuPowerWatts = totalGpusNeeded * gpu.tdp;
      const serverHostOverheadWatts = nodesNeeded * (serverChassis.hostIdlePowerWatts || 700);
      const totalPowerKw = (totalGpuPowerWatts + serverHostOverheadWatts) / 1000;

      // Itemized Capex Breakdown:
      // 1. GPU Hardware Capex
      const gpuCapex = totalGpusNeeded * gpu.capexPrice;
      // 2. Server Chassis Capex (Dell PowerEdge / Supermicro Host nodes)
      const serverNodesCapex = nodesNeeded * serverChassis.baseChassisPrice;
      // 3. Cluster Inter-Node High-Speed Switching (e.g. 400G InfiniBand Spine/Leaf switches if nodes > 1)
      const networkingCapex = nodesNeeded > 1 ? (nodesNeeded * 4000 + 8000) : 0;
      // Total Turnkey Capex
      const hardwareCapex = gpuCapex + serverNodesCapex + networkingCapex;

      // Cloud Costs
      const cloudMonthlyOnDemand = totalGpusNeeded * gpu.cloudHourlyOnDemand * 730;
      const cloudMonthlyReserved1Yr = totalGpusNeeded * gpu.cloudHourly1YrReserved * 730;

      // Latency SLA Check
      const meetsTtftSla = estimatedTtftMs <= targetTtftMs * 1.25;
      const meetsTpsSla = singleStreamDecodeTps >= targetTpsPerStream * 0.85;
      const slaStatus = (meetsTtftSla && meetsTpsSla) ? 'optimal' : (meetsTtftSla || meetsTpsSla) ? 'acceptable' : 'bottleneck';

      return {
        gpu,
        serverChassis,
        minGpusForVram,
        tp,
        pp,
        dpReplicas,
        gpusPerInstance,
        totalGpusNeeded,
        nodesNeeded,
        totalVramAvailableGb: totalGpusNeeded * gpu.vram,
        vramUtilizationPercent: Math.min(99, Math.round((totalVramRecommendedGb / (gpusPerInstance * gpu.vram)) * 100)),
        singleStreamDecodeTps,
        estimatedTtftMs,
        maxBatchThroughputTps,
        totalPowerKw,
        // Itemized Capex details
        gpuCapex,
        serverNodesCapex,
        networkingCapex,
        hardwareCapex,
        cloudMonthlyOnDemand,
        cloudMonthlyReserved1Yr,
        meetsTtftSla,
        meetsTpsSla,
        slaStatus
      };
    });

    // Sort recommendations into categories
    const sortedRecommendations = [...gpuRecommendations].sort((a, b) => a.totalGpusNeeded - b.totalGpusNeeded);

    // Pick recommended setups
    const bestEnterprise = gpuRecommendations.find(r => r.gpu.tier.includes('Datacenter') && r.slaStatus === 'optimal') || gpuRecommendations[0];
    const bestValue = gpuRecommendations.find(r => (r.gpu.id === 'l40s' || r.gpu.id === 'rtx-6000-ada' || r.gpu.id === 'rtx-5090') && r.slaStatus !== 'bottleneck') || bestEnterprise;
    const bestLocal = gpuRecommendations.find(r => r.gpu.id === 'apple-m4-ultra-192' || r.gpu.id === 'rtx-4090' || r.gpu.id === 'rtx-5090') || bestValue;

    return {
      traffic: {
        totalUsers,
        reqPerUser,
        peakMultiplier,
        workHours,
        totalDailyRequests,
        avgRps: avgRps.toFixed(2),
        peakRps: peakRps.toFixed(2),
        avgConcurrentStreams,
        peakConcurrentStreams,
        totalDailyTokens,
        peakInputTokensPerSec: Math.round(peakInputTokensPerSec),
        peakOutputTokensPerSec: Math.round(peakOutputTokensPerSec),
        peakTotalTokensPerSec: Math.round(peakTotalTokensPerSec),
        estRequestDurationSec: estRequestDurationSec.toFixed(2)
      },
      tokens: {
        inputTokens,
        outputTokens,
        seqLength,
        targetTtftMs,
        targetTpsPerStream
      },
      memory: {
        weightsVramGb: Number(weightsVramGb.toFixed(2)),
        peakKvCacheTotalGb: Number(peakKvCacheTotalGb.toFixed(2)),
        avgKvCacheTotalGb: Number(avgKvCacheTotalGb.toFixed(2)),
        kvPerStreamMb: Number((kvPerStreamGb * 1024).toFixed(1)),
        activationBufferGb: Number(activationBufferGb.toFixed(2)),
        totalVramRequiredRawGb: Number(totalVramRequiredRawGb.toFixed(2)),
        totalVramRecommendedGb: Number(totalVramRecommendedGb.toFixed(2)),
        gpuMemoryUtilization
      },
      gpuRecommendations,
      highlights: {
        bestEnterprise,
        bestValue,
        bestLocal
      }
    };
  }
}
