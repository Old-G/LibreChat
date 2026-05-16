import { Plug } from 'lucide-react';
import { Button } from '@librechat/client';
import type { MCPServerStatus } from 'librechat-data-provider';
import type { TranslationKeys } from '~/hooks';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

export type ServerCardConnectionState =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'error'
  | 'unknown';

export interface ServerCardProps {
  serverName: string;
  displayName?: string;
  description?: string;
  transport?: string;
  toolsCount?: number;
  status?: ServerCardConnectionState;
}

export function deriveConnectionState(status?: MCPServerStatus): ServerCardConnectionState {
  if (!status) return 'unknown';
  return (status.connectionState as ServerCardConnectionState) ?? 'unknown';
}

const statusStyles: Record<
  ServerCardConnectionState,
  { dot: string; text: string; label: TranslationKeys }
> = {
  connected: {
    dot: 'bg-green-500',
    text: 'text-green-600 dark:text-green-400',
    label: 'com_miron_mcp_status_connected',
  },
  connecting: {
    dot: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    label: 'com_miron_mcp_status_connecting',
  },
  disconnected: {
    dot: 'bg-gray-400',
    text: 'text-text-secondary',
    label: 'com_miron_mcp_status_disconnected',
  },
  error: {
    dot: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    label: 'com_miron_mcp_status_error',
  },
  unknown: {
    dot: 'bg-gray-400',
    text: 'text-text-secondary',
    label: 'com_miron_mcp_status_unknown',
  },
};

export default function ServerCard({
  serverName,
  displayName,
  description,
  transport,
  toolsCount,
  status = 'unknown',
}: ServerCardProps) {
  const localize = useLocalize();
  const style = statusStyles[status];
  const title = displayName || serverName;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border-light bg-surface-primary p-4',
        'transition-colors hover:border-border-medium',
      )}
      role="group"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              'bg-primary/10 text-primary',
            )}
            aria-hidden="true"
          >
            <Plug className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-primary">{title}</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs',
                  'bg-surface-secondary',
                  style.text,
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />
                {localize(style.label)}
              </span>
            </div>
            {description ? (
              <span className="mt-0.5 text-sm text-text-secondary">{description}</span>
            ) : null}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled
          aria-label={localize('com_miron_mcp_details')}
        >
          {localize('com_miron_mcp_details')}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
        {typeof toolsCount === 'number' ? (
          <span>
            {localize('com_miron_mcp_tools_count', { 0: String(toolsCount) })}
          </span>
        ) : null}
        {transport ? (
          <span>
            {localize('com_miron_mcp_transport')}: <span className="font-mono">{transport}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
