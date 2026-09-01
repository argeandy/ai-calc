/**
 * Total Cost of Ownership (TCO) & API Cost Comparison Engine
 */

export const COMMERCIAL_API_PRICING = [
  {
    id: 'openai-gpt4o',
    name: 'OpenAI GPT-4o',
    inputPricePerMillion: 2.50, // USD
    outputPricePerMillion: 10.00
  },
  {
    id: 'anthropic-sonnet-3-5',
    name: 'Anthropic Claude 3.5 Sonnet',
    inputPricePerMillion: 3.00,
    outputPricePerMillion: 15.00
  },
  {
    id: 'deepseek-v3-api',
    name: 'DeepSeek V3 (Official API)',
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28
  },
  {
    id: 'deepseek-r1-api',
    name: 'DeepSeek R1 Reasoning API',
    inputPricePerMillion: 0.55,
    outputPricePerMillion: 2.19
  },
  {
    id: 'together-llama-70b',
    name: 'Hosted Llama 3.3 70B (Together/Fireworks)',
    inputPricePerMillion: 0.88,
    outputPricePerMillion: 0.88
  },
  {
    id: 'hosted-llama-8b',
    name: 'Hosted Llama 3.1 8B (Together/Groq)',
    inputPricePerMillion: 0.18,
    outputPricePerMillion: 0.18
  }
];

export class TcoCalculator {
  /**
   * Calculate TCO for On-Prem, Cloud, and Commercial APIs
   * @param {Object} calcResult - Result from HardwareCalculator.calculate
   * @param {Object} gpuRec - The chosen GPU recommendation object
   * @param {Object} costParams - User configured electricity & datacenter cost parameters
   */
  static calculateTco(calcResult, gpuRec, costParams = {}) {
    const electricityKwhCost = Number(costParams.electricityKwhCost) || 0.22; // EUR/kWh
    const pueFactor = Number(costParams.pueFactor) || 1.25; // Power Usage Effectiveness
    const hardwareAmortizationYears = Number(costParams.hardwareAmortizationYears) || 3;
    const maintenanceRatePerYear = Number(costParams.maintenanceRatePerYear) || 0.12; // 12% warranty/spares
    const monthlyDays = 30.5;

    // Traffic volume
    const dailyInputTokens = calcResult.traffic.totalDailyRequests * calcResult.tokens.inputTokens;
    const dailyOutputTokens = calcResult.traffic.totalDailyRequests * calcResult.tokens.outputTokens;
    const monthlyInputTokens = dailyInputTokens * monthlyDays;
    const monthlyOutputTokens = dailyOutputTokens * monthlyDays;
    const monthlyTotalTokens = monthlyInputTokens + monthlyOutputTokens;

    // 1. On-Premises Monthly Cost with Itemized Capex
    const hardwareCapex = gpuRec.hardwareCapex;
    const gpuCapex = gpuRec.gpuCapex;
    const serverNodesCapex = gpuRec.serverNodesCapex;
    const networkingCapex = gpuRec.networkingCapex;

    const monthlyDepreciation = hardwareCapex / (hardwareAmortizationYears * 12);
    
    // Electricity Consumption (Power in kW * 24h * 30.5 days * PUE)
    const effectiveMonthlyKwh = gpuRec.totalPowerKw * 24 * monthlyDays * pueFactor;
    const monthlyElectricityCost = effectiveMonthlyKwh * electricityKwhCost;
    const monthlyMaintenanceCost = (hardwareCapex * maintenanceRatePerYear) / 12;
    const onPremTotalMonthlyCost = monthlyDepreciation + monthlyElectricityCost + monthlyMaintenanceCost;
    const onPremCostPer1kTokens = monthlyTotalTokens > 0 ? (onPremTotalMonthlyCost / (monthlyTotalTokens / 1000)) : 0;

    // 2. Cloud Reserved & On-Demand Costs
    const cloudMonthlyOnDemand = gpuRec.cloudMonthlyOnDemand;
    const cloudMonthlyReserved1Yr = gpuRec.cloudMonthlyReserved1Yr;
    const cloudMonthlyReserved3Yr = gpuRec.cloudMonthlyReserved1Yr * 0.78; // Approx 22% additional 3yr discount
    
    const cloudCostPer1kTokens1Yr = monthlyTotalTokens > 0 ? (cloudMonthlyReserved1Yr / (monthlyTotalTokens / 1000)) : 0;

    // 3. Commercial API Comparison
    const apiComparisons = COMMERCIAL_API_PRICING.map(api => {
      const monthlyInputCost = (monthlyInputTokens / 1_000_000) * api.inputPricePerMillion;
      const monthlyOutputCost = (monthlyOutputTokens / 1_000_000) * api.outputPricePerMillion;
      const monthlyTotalCost = monthlyInputCost + monthlyOutputCost;
      const costPer1kTokens = monthlyTotalTokens > 0 ? (monthlyTotalCost / (monthlyTotalTokens / 1000)) : 0;

      // Break-even vs On-Premises Capex & Opex
      const monthlySelfHostOpex = monthlyElectricityCost + monthlyMaintenanceCost;
      const monthlyNetSavingsVsCapex = monthlyTotalCost - monthlySelfHostOpex;
      const breakEvenMonths = monthlyNetSavingsVsCapex > 0 
        ? Math.ceil(hardwareCapex / monthlyNetSavingsVsCapex) 
        : null;

      return {
        ...api,
        monthlyTotalCost: Math.round(monthlyTotalCost),
        costPer1kTokens: Number(costPer1kTokens.toFixed(4)),
        breakEvenMonths
      };
    });

    return {
      monthlyTokens: {
        inputMillions: Number((monthlyInputTokens / 1_000_000).toFixed(2)),
        outputMillions: Number((monthlyOutputTokens / 1_000_000).toFixed(2)),
        totalMillions: Number((monthlyTotalTokens / 1_000_000).toFixed(2))
      },
      onPrem: {
        capexTotal: Math.round(hardwareCapex),
        gpuCapex: Math.round(gpuCapex),
        serverNodesCapex: Math.round(serverNodesCapex),
        networkingCapex: Math.round(networkingCapex),
        monthlyDepreciation: Math.round(monthlyDepreciation),
        monthlyElectricityCost: Math.round(monthlyElectricityCost),
        monthlyMaintenanceCost: Math.round(monthlyMaintenanceCost),
        totalMonthlyCost: Math.round(onPremTotalMonthlyCost),
        costPer1kTokens: Number(onPremCostPer1kTokens.toFixed(4)),
        effectiveMonthlyKwh: Math.round(effectiveMonthlyKwh),
        serverChassisName: gpuRec.serverChassis.name,
        nodesNeeded: gpuRec.nodesNeeded
      },
      cloud: {
        monthlyOnDemand: Math.round(cloudMonthlyOnDemand),
        monthlyReserved1Yr: Math.round(cloudMonthlyReserved1Yr),
        monthlyReserved3Yr: Math.round(cloudMonthlyReserved3Yr),
        costPer1kTokens1Yr: Number(cloudCostPer1kTokens1Yr.toFixed(4))
      },
      apis: apiComparisons
    };
  }
}
