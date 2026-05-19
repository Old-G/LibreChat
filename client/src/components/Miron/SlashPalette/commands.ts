import type { TranslationKeys } from '~/hooks';

export type CommandCategory = 'chat' | 'tools' | 'info';

export type CommandActionType = 'insert' | 'invoke';

export interface MironCommand {
  id: string;
  trigger: string;
  category: CommandCategory;
  labelKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  action: CommandActionType;
  insertText?: string;
  requiresConfirm?: boolean;
}

export const MIRON_COMMANDS: readonly MironCommand[] = [
  {
    id: 'web',
    trigger: '/web',
    category: 'tools',
    labelKey: 'com_miron_palette_cmd_web_label',
    descriptionKey: 'com_miron_palette_cmd_web_desc',
    action: 'insert',
    insertText: '/web ',
  },
  {
    id: 'usage',
    trigger: '/usage',
    category: 'info',
    labelKey: 'com_miron_palette_cmd_usage_label',
    descriptionKey: 'com_miron_palette_cmd_usage_desc',
    action: 'invoke',
  },
  {
    id: 'new',
    trigger: '/new',
    category: 'chat',
    labelKey: 'com_miron_palette_cmd_new_label',
    descriptionKey: 'com_miron_palette_cmd_new_desc',
    action: 'invoke',
  },
  {
    id: 'clear',
    trigger: '/clear',
    category: 'chat',
    labelKey: 'com_miron_palette_cmd_clear_label',
    descriptionKey: 'com_miron_palette_cmd_clear_desc',
    action: 'invoke',
    requiresConfirm: true,
  },
  {
    id: 'help',
    trigger: '/help',
    category: 'info',
    labelKey: 'com_miron_palette_cmd_help_label',
    descriptionKey: 'com_miron_palette_cmd_help_desc',
    action: 'invoke',
  },
] as const;

const lower = (input: string): string => input.toLowerCase();

const matchesQuery = (haystack: string, query: string): boolean => {
  if (query.length === 0) {
    return true;
  }
  const target = lower(haystack);
  let cursor = 0;
  for (let i = 0; i < query.length; i++) {
    const ch = query[i];
    const next = target.indexOf(ch, cursor);
    if (next === -1) {
      return false;
    }
    cursor = next + 1;
  }
  return true;
};

export interface ScoredCommand {
  command: MironCommand;
  score: number;
}

const scoreCommand = (command: MironCommand, query: string, label: string): number => {
  if (query.length === 0) {
    return 0;
  }
  const trigger = lower(command.trigger);
  const labelLower = lower(label);
  if (trigger.startsWith(query)) {
    return 100;
  }
  if (trigger.includes(query)) {
    return 60;
  }
  if (labelLower.startsWith(query)) {
    return 40;
  }
  if (labelLower.includes(query)) {
    return 20;
  }
  if (matchesQuery(trigger, query) || matchesQuery(labelLower, query)) {
    return 10;
  }
  return -1;
};

export const filterCommands = (
  commands: readonly MironCommand[],
  rawQuery: string,
  labelFor: (cmd: MironCommand) => string,
): MironCommand[] => {
  const query = lower(rawQuery.trim().replace(/^\//, ''));
  if (query.length === 0) {
    return [...commands];
  }
  const scored: ScoredCommand[] = [];
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    const score = scoreCommand(command, query, labelFor(command));
    if (score >= 0) {
      scored.push({ command, score });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.command);
};

export const groupByCategory = (
  commands: readonly MironCommand[],
): Record<CommandCategory, MironCommand[]> => {
  const result: Record<CommandCategory, MironCommand[]> = {
    chat: [],
    tools: [],
    info: [],
  };
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    result[command.category].push(command);
  }
  return result;
};

export const CATEGORY_ORDER: readonly CommandCategory[] = ['chat', 'tools', 'info'];

export const CATEGORY_LABEL_KEYS: Record<CommandCategory, TranslationKeys> = {
  chat: 'com_miron_palette_category_chat',
  tools: 'com_miron_palette_category_tools',
  info: 'com_miron_palette_category_info',
};
