import { useMemo, useState } from 'react';
import { Plus, Server } from 'lucide-react';
import { Button } from '@librechat/client';
import { Permissions, PermissionTypes, ResourceType } from 'librechat-data-provider';
import { useGetAllEffectivePermissionsQuery } from 'librechat-data-provider/react-query';
import { useLocalize, useHasAccess, useMCPConnectionStatus } from '~/hooks';
import type { MCPServerDefinition } from '~/hooks';
import { useMCPServersQuery } from '~/data-provider';
import MCPServerDialog from '~/components/SidePanel/MCPBuilder/MCPServerDialog';
import IntegrationPresets from './IntegrationPresets';
import ServerCard, { deriveConnectionState } from './ServerCard';

const FALLBACK_SERVER_NAME = 'bitrix24';

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<MCPServerDefinition | null>(null);

  const { data: loadedServers, isLoading } = useMCPServersQuery({ enabled: canUseMcp });
  const { connectionStatus } = useMCPConnectionStatus({ enabled: canUseMcp });
  const { data: permissionsMap } = useGetAllEffectivePermissionsQuery(ResourceType.MCPSERVER, {
    enabled: canUseMcp,
  });

  const servers = useMemo<MCPServerDefinition[]>(() => {
    if (!loadedServers) return [];
    return Object.entries(loadedServers).map(([serverName, metadata]) => {
      const { dbId, consumeOnly, ...config } = metadata;
      const effectivePermissions = dbId && permissionsMap?.[dbId] ? permissionsMap[dbId] : 1;
      return { serverName, dbId, effectivePermissions, consumeOnly, config };
    });
  }, [loadedServers, permissionsMap]);

  const hasNoServers = !isLoading && servers.length === 0;

  const openCreate = () => {
    setEditingServer(null);
    setIsDialogOpen(true);
  };

  const openEdit = (server: MCPServerDefinition) => {
    setEditingServer(server);
    setIsDialogOpen(true);
  };

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

      {canCreateMcp ? <IntegrationPresets onSelect={openCreate} /> : null}

      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-text-tertiary">
          {localize('com_miron_mcp_connected_section')}
        </span>
        <Button
          variant="default"
          size="sm"
          disabled={!canCreateMcp}
          onClick={openCreate}
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
      ) : hasNoServers ? (
        <div className="rounded-xl border border-dashed border-border-light bg-surface-secondary p-6 text-center text-sm text-text-secondary">
          {localize('com_miron_mcp_empty')}
        </div>
      ) : (
        <ul className="flex flex-col gap-3" aria-label={localize('com_miron_mcp_title')}>
          {servers.map((server) => {
            const isFallback = server.serverName === FALLBACK_SERVER_NAME && !server.dbId;
            const transport = server.config?.type;
            const status = deriveConnectionState(connectionStatus?.[server.serverName]);
            return (
              <li key={server.serverName}>
                <ServerCard
                  serverName={server.serverName}
                  displayName={server.config?.title || server.serverName}
                  description={server.config?.description}
                  transport={transport}
                  toolsCount={undefined}
                  status={status}
                  isEditable={!isFallback && Boolean(server.dbId)}
                  onEdit={() => openEdit(server)}
                />
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-text-tertiary">{localize('com_miron_mcp_footer_hint')}</p>

      <MCPServerDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingServer(null);
        }}
        server={editingServer}
      />
    </div>
  );
}
