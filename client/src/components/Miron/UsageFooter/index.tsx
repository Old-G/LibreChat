import { useChatContext } from '~/Providers';
import { useLocalize } from '~/hooks';
import useUsage from './useUsage';

const formatTokens = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  }
  return value.toString();
};

const formatCost = (value: number | null, fallback: string): string => {
  if (value === null) {
    return fallback;
  }
  if (value < 0.001) {
    return '<$0.001';
  }
  return `$${value.toFixed(value < 0.01 ? 4 : 3)}`;
};

export default function UsageFooter() {
  const localize = useLocalize();
  const { conversation } = useChatContext();
  const conversationId = conversation?.conversationId ?? null;
  const usage = useUsage(conversationId);

  if (!usage.hasData) {
    return null;
  }

  return (
    <div
      className="mx-auto flex w-full max-w-3xl items-center justify-center gap-3 px-3 pb-1 pt-0 text-[11px] text-text-tertiary xl:max-w-4xl"
      aria-label={localize('com_miron_usage_panel_title')}
    >
      <span>
        {localize('com_miron_usage_prompt')}: {formatTokens(usage.promptTokens)}
      </span>
      <span aria-hidden="true">·</span>
      <span>
        {localize('com_miron_usage_completion')}: {formatTokens(usage.completionTokens)}
      </span>
      <span aria-hidden="true">·</span>
      <span>
        {localize('com_miron_usage_cost')}:{' '}
        {formatCost(usage.estimatedCost, localize('com_miron_usage_cost_unknown'))}
      </span>
    </div>
  );
}
