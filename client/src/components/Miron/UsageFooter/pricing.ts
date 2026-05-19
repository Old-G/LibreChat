export interface ModelPricing {
  promptPerMillion: number;
  completionPerMillion: number;
}

const PRICING: Readonly<Record<string, ModelPricing>> = {
  'gpt-4o-mini': { promptPerMillion: 0.15, completionPerMillion: 0.6 },
  'gpt-4o': { promptPerMillion: 2.5, completionPerMillion: 10 },
  'gpt-4.1-mini': { promptPerMillion: 0.4, completionPerMillion: 1.6 },
  'gpt-4.1': { promptPerMillion: 2, completionPerMillion: 8 },
  'gpt-3.5-turbo': { promptPerMillion: 0.5, completionPerMillion: 1.5 },
};

const matchKey = (model: string): string | null => {
  const lower = model.toLowerCase();
  if (PRICING[lower]) {
    return lower;
  }
  const keys = Object.keys(PRICING);
  for (let i = 0; i < keys.length; i++) {
    if (lower.startsWith(keys[i])) {
      return keys[i];
    }
  }
  return null;
};

export const getPricing = (model: string | null | undefined): ModelPricing | null => {
  if (!model) {
    return null;
  }
  const key = matchKey(model);
  if (!key) {
    return null;
  }
  return PRICING[key];
};

export const estimateCost = (
  model: string | null | undefined,
  promptTokens: number,
  completionTokens: number,
): number | null => {
  const pricing = getPricing(model);
  if (!pricing) {
    return null;
  }
  const promptCost = (promptTokens / 1_000_000) * pricing.promptPerMillion;
  const completionCost = (completionTokens / 1_000_000) * pricing.completionPerMillion;
  return promptCost + completionCost;
};
