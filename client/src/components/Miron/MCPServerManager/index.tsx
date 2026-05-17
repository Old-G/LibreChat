import { useMemo, useState } from 'react';
import { Plus, Server } from 'lucide-react';
import { Button } from '@librechat/client';
import { Permissions, PermissionTypes } from 'librechat-data-provider';
import { useLocalize, useHasAccess, useMCPConnectionStatus } from '~/hooks';
import { useMCPServersQuery } from '~/data-provider';
import MCPServerDialog from '~/components/SidePanel/MCPBuilder/MCPServerDialog';
import ServerCard, { deriveConnectionState } from './ServerCard';
import type { ServerCardProps } from './ServerCard';

const FALLBACK_SERVERS: ServerCardProps[] = [
  {
    serverName: 'bitrix24',
    displayName: 'Bitrix24',
    description: 'Корпоративный CRM и Project Management',
    transport: 'stdio',
    toolsCount: 50,
    status: 'connected',
  },
];

function readTransport(config: { type?: string } | undefined): string | undefined {
  if (!config?.type) return undefined;
  return config.type;
}

export default function MCPServerManager() {
  const localize = useLocalize();
  const canUseMcp = useHasAccess({
    permissionType: PermissionTypes.MCP_SERVERS,
    permission: Permissions.USE,
  });
  const canCreateMcp = useHasAccess({
    permissionType: PermissionTypes.MCP_SERVERS,
    permission: Permissions.CREATE,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: loadedServers, isLoading } = useMCPServersQuery({ enabled: canUseMcp });
  const { connectionStatus } = useMCPConnectionStatus({ enabled: canUseMcp });

  const servers = useMemo<ServerCardProps[]>(() => {
    if (!loadedServers || Object.keys(loadedServers).length === 0) {
      // TODO: replace fallback with real API data once at least one MCP server is registered.
      return FALLBACK_SERVERS;
    }

    return Object.entries(loadedServers).map(([serverName, metadata]) => {
      const { consumeOnly: _consumeOnly, dbId: _dbId, ...config } = metadata;
      const status = deriveConnectionState(connectionStatus?.[serverName]);
      return {
        serverName,
        displayName: config.title || serverName,
        description: config.description,
        transport: readTransport(config),
        // TODO: derive real tool count from useMCPToolsQuery once we surface per-server tool lists here.
        toolsCount: undefined,
        status,
      } satisfies ServerCardProps;
    });
  }, [loadedServers, connectionStatus]);

  return (
    <div className="flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="text-base font-semibold text-text-primary">
            {localize('com_miron_mcp_title')}
          </h3>
        </div>
        <p className="text-sm text-text-secondary">{localize('com_miron_mcp_subtitle')}</p>
      </header>

      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-text-tertiary">
          {localize('com_miron_mcp_connected_section')}
        </span>
        <Button
          variant="default"
          size="sm"
          disabled={!canCreateMcp}
          onClick={() => setIsCreateOpen(true)}
          aria-label={localize('com_miron_mcp_add_button')}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {localize('com_miron_mcp_add_button')}
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-border-light bg-surface-secondary p-6 text-center text-sm text-text-secondary">
          {localize('com_miron_mcp_loading')}
        </div>
      ) : servers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-light bg-surface-secondary p-6 text-center text-sm text-text-secondary">
          {localize('com_miron_mcp_empty')}
        </div>
      ) : (
        <ul className="flex flex-col gap-3" aria-label={localize('com_miron_mcp_title')}>
          {servers.map((server) => (
            <li key={server.serverName}>
              <ServerCard {...server} />
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-text-tertiary">{localize('com_miron_mcp_footer_hint')}</p>

      <MCPServerDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
