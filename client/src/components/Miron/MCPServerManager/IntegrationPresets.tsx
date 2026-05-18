import { Briefcase, ClipboardList, Database, Mail, MessageSquare, Settings2 } from 'lucide-react';
import { useToastContext } from '@librechat/client';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';
import { INTEGRATION_PRESETS, type IntegrationPreset } from './presetData';

const ICON_MAP = {
  Database,
  Briefcase,
  MessageSquare,
  Mail,
  ClipboardList,
  Settings2,
} as const;

interface IntegrationPresetsProps {
  onSelect: () => void;
  disabled?: boolean;
}

export default function IntegrationPresets({ onSelect, disabled = false }: IntegrationPresetsProps) {
  const localize = useLocalize();
  const { showToast } = useToastContext();

  const handleClick = (preset: IntegrationPreset) => {
    if (disabled) return;

    const lines = [
      `${localize(preset.label)} — ${localize(preset.description)}`,
      `${localize('com_miron_preset_url_label')}: ${preset.urlPattern}`,
      `${localize('com_miron_preset_auth_label')}: ${localize(preset.authHint)}`,
    ];

    showToast({
      message: lines.join('\n'),
      duration: 12000,
    });

    onSelect();
  };

  return (
    <section
      aria-label={localize('com_miron_preset_section_title')}
      className="flex flex-col gap-3"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs uppercase tracking-wide text-text-tertiary">
          {localize('com_miron_preset_section_title')}
        </span>
        <span className="text-xs text-text-tertiary">
          {localize('com_miron_preset_section_hint')}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {INTEGRATION_PRESETS.map((preset) => {
          const Icon = ICON_MAP[preset.icon];
          return (
            <li key={preset.id}>
              <button
                type="button"
                onClick={() => handleClick(preset)}
                disabled={disabled}
                className={cn(
                  'group flex w-full flex-col items-start gap-1 rounded-xl border border-border-light bg-surface-primary p-3',
                  'text-left transition-colors',
                  'hover:border-primary/40 hover:bg-primary/5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary',
                  'disabled:cursor-not-allowed disabled:opacity-60',
                  preset.featured && 'border-primary/30',
                )}
                aria-label={localize(preset.label)}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      'bg-primary/10 text-primary',
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {preset.featured ? (
                    <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                      {localize('com_miron_preset_featured_badge')}
                    </span>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {localize(preset.label)}
                </span>
                <span className="text-xs leading-snug text-text-secondary">
                  {localize(preset.description)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
