import type { TranslationKeys } from '~/hooks';

/**
 * Miron — preset list of Russian B2B integrations that ship out of the box.
 *
 * Each preset shows up as a quick-pick card in the MCP Server Manager. Clicking it
 * opens the create dialog and toasts a URL pattern + auth hint so the admin
 * can paste a value matching their corporate deployment.
 *
 * `urlPattern` is intentionally not auto-filled into the form yet — the user
 * substitutes their own host. We can wire defaults into useMCPServerForm later.
 */
export interface IntegrationPreset {
  id: string;
  /** Display name (translation key) */
  label: TranslationKeys;
  /** One-line description shown under the title (translation key) */
  description: TranslationKeys;
  /** Lucide icon name (string lookup is done by the component) */
  icon: 'Database' | 'Briefcase' | 'MessageSquare' | 'Mail' | 'ClipboardList' | 'Settings2';
  /** URL pattern shown in toast as guidance */
  urlPattern: string;
  /** Authentication hint shown in toast */
  authHint: TranslationKeys;
  /** Default transport — used as a hint, user can switch in form */
  transport: 'streamable-http' | 'sse';
  /** Optional docs URL (external) */
  docsUrl?: string;
  /** Marks "headline" integrations (rendered first) */
  featured?: boolean;
}

export const INTEGRATION_PRESETS: IntegrationPreset[] = [
  {
    id: '1c-odata',
    label: 'com_miron_preset_1c_label',
    description: 'com_miron_preset_1c_description',
    icon: 'Database',
    urlPattern: 'https://<host>/<base>/odata/standard.odata/',
    authHint: 'com_miron_preset_1c_auth',
    transport: 'streamable-http',
    docsUrl: 'https://its.1c.ru/db/v8323doc',
    featured: true,
  },
  {
    id: 'bitrix24',
    label: 'com_miron_preset_bitrix24_label',
    description: 'com_miron_preset_bitrix24_description',
    icon: 'Briefcase',
    urlPattern: 'https://<portal>.bitrix24.ru/rest/<user_id>/<webhook_token>/',
    authHint: 'com_miron_preset_bitrix24_auth',
    transport: 'streamable-http',
    docsUrl: 'https://apidocs.bitrix24.com/',
    featured: true,
  },
  {
    id: 'vk-teams',
    label: 'com_miron_preset_vkteams_label',
    description: 'com_miron_preset_vkteams_description',
    icon: 'MessageSquare',
    urlPattern: 'https://myteam.mail.ru/bot/v1/',
    authHint: 'com_miron_preset_vkteams_auth',
    transport: 'streamable-http',
    docsUrl: 'https://teams.vk.com/botapi/',
  },
  {
    id: 'yandex-360',
    label: 'com_miron_preset_y360_label',
    description: 'com_miron_preset_y360_description',
    icon: 'Mail',
    urlPattern: 'https://api360.yandex.net/',
    authHint: 'com_miron_preset_y360_auth',
    transport: 'streamable-http',
    docsUrl: 'https://yandex.ru/dev/api360/',
  },
  {
    id: 'yandex-tracker',
    label: 'com_miron_preset_ytracker_label',
    description: 'com_miron_preset_ytracker_description',
    icon: 'ClipboardList',
    urlPattern: 'https://api.tracker.yandex.net/v3/',
    authHint: 'com_miron_preset_ytracker_auth',
    transport: 'streamable-http',
    docsUrl: 'https://yandex.cloud/ru/docs/tracker/about-api',
  },
  {
    id: 'custom',
    label: 'com_miron_preset_custom_label',
    description: 'com_miron_preset_custom_description',
    icon: 'Settings2',
    urlPattern: 'https://mcp.example.com',
    authHint: 'com_miron_preset_custom_auth',
    transport: 'streamable-http',
  },
];
