import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';
import { useLocalize } from '~/hooks';
import useUsage from './useUsage';

interface UsagePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string | null;
}

const formatNumber = (value: number): string => new Intl.NumberFormat().format(value);

const formatCost = (value: number | null, fallback: string): string => {
  if (value === null) {
    return fallback;
  }
  return `$${value.toFixed(value < 0.01 ? 4 : 3)}`;
};

export default function UsagePanel({ open, onOpenChange, conversationId }: UsagePanelProps) {
  const localize = useLocalize();
  const usage = useUsage(conversationId);
  const total = usage.promptTokens + usage.completionTokens;

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent className="w-11/12 max-w-md">
        <OGDialogHeader>
          <OGDialogTitle>{localize('com_miron_usage_panel_title')}</OGDialogTitle>
        </OGDialogHeader>

        <div className="flex flex-col gap-4 px-2 pb-2 pt-1">
          <section className="flex flex-col gap-2 rounded-lg border border-border-light bg-surface-secondary px-3 py-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              {localize('com_miron_usage_panel_conversation')}
            </h4>

            <dl className="grid grid-cols-2 gap-y-1 text-sm">
              <dt className="text-text-tertiary">{localize('com_miron_usage_panel_messages')}</dt>
              <dd className="text-right font-mono text-text-primary">
                {formatNumber(usage.messageCount)}
              </dd>

              <dt className="text-text-tertiary">{localize('com_miron_usage_prompt')}</dt>
              <dd className="text-right font-mono text-text-primary">
                {formatNumber(usage.promptTokens)}
              </dd>

              <dt className="text-text-tertiary">{localize('com_miron_usage_completion')}</dt>
              <dd className="text-right font-mono text-text-primary">
                {formatNumber(usage.completionTokens)}
              </dd>

              <dt className="text-text-tertiary">
                {localize('com_miron_usage_panel_total_tokens')}
              </dt>
              <dd className="text-right font-mono text-text-primary">{formatNumber(total)}</dd>

              <dt className="text-text-tertiary">
                {localize('com_miron_usage_panel_estimated_cost')}
              </dt>
              <dd className="text-right font-mono text-text-primary">
                {formatCost(usage.estimatedCost, localize('com_miron_usage_cost_unknown'))}
              </dd>
            </dl>
          </section>

          <p className="text-[11px] leading-snug text-text-tertiary">
            {localize('com_miron_usage_panel_workspace_note')}
          </p>
        </div>
      </OGDialogContent>
    </OGDialog>
  );
}
