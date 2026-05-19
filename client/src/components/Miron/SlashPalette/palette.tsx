import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';
import { Search } from 'lucide-react';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';
import { CATEGORY_LABEL_KEYS, CATEGORY_ORDER, MIRON_COMMANDS, filterCommands } from './commands';
import type { CommandCategory, MironCommand } from './commands';

interface PaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (command: MironCommand) => void;
}

interface FlatItem {
  kind: 'header' | 'command';
  category: CommandCategory;
  command?: MironCommand;
}

const buildFlatList = (commands: MironCommand[]): FlatItem[] => {
  const items: FlatItem[] = [];
  for (let i = 0; i < CATEGORY_ORDER.length; i++) {
    const category = CATEGORY_ORDER[i];
    const inCategory = commands.filter((cmd) => cmd.category === category);
    if (inCategory.length === 0) {
      continue;
    }
    items.push({ kind: 'header', category });
    for (let j = 0; j < inCategory.length; j++) {
      items.push({ kind: 'command', category, command: inCategory[j] });
    }
  }
  return items;
};

const commandIndices = (items: FlatItem[]): number[] => {
  const result: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === 'command') {
      result.push(i);
    }
  }
  return result;
};

export default function Palette({ open, onOpenChange, onSelect }: PaletteProps) {
  const localize = useLocalize();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const labelFor = useCallback((cmd: MironCommand) => localize(cmd.labelKey), [localize]);

  const filtered = useMemo(
    () => filterCommands(MIRON_COMMANDS, query, labelFor),
    [query, labelFor],
  );

  const items = useMemo(() => buildFlatList(filtered), [filtered]);
  const cmdIndices = useMemo(() => commandIndices(items), [items]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
      return;
    }
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const moveActive = useCallback(
    (delta: number) => {
      if (cmdIndices.length === 0) {
        return;
      }
      setActiveIndex((prev) => {
        const next = prev + delta;
        if (next < 0) {
          return cmdIndices.length - 1;
        }
        if (next >= cmdIndices.length) {
          return 0;
        }
        return next;
      });
    },
    [cmdIndices.length],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActive(1);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActive(-1);
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        if (cmdIndices.length === 0) {
          return;
        }
        const targetIndex = cmdIndices[activeIndex] ?? cmdIndices[0];
        const item = items[targetIndex];
        if (item.kind === 'command' && item.command) {
          onSelect(item.command);
        }
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
      }
    },
    [activeIndex, cmdIndices, items, moveActive, onOpenChange, onSelect],
  );

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent className="w-11/12 max-w-xl overflow-hidden p-0">
        <OGDialogHeader className="sr-only">
          <OGDialogTitle>{localize('com_miron_palette_title')}</OGDialogTitle>
        </OGDialogHeader>
        <div className="flex items-center gap-2 border-b border-border-light px-4 py-3">
          <Search className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={localize('com_miron_palette_placeholder')}
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            aria-label={localize('com_miron_palette_title')}
          />
        </div>
        <div className="max-h-80 overflow-y-auto py-2" role="listbox">
          {items.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-text-tertiary">
              {localize('com_miron_palette_empty')}
            </div>
          )}
          {items.map((item, idx) => {
            if (item.kind === 'header') {
              return (
                <div
                  key={`header-${item.category}`}
                  className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary"
                >
                  {localize(CATEGORY_LABEL_KEYS[item.category])}
                </div>
              );
            }
            const command = item.command;
            if (!command) {
              return null;
            }
            const cmdPosition = cmdIndices.indexOf(idx);
            const isActive = cmdPosition === activeIndex;
            return (
              <button
                key={command.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => onSelect(command)}
                onMouseEnter={() => setActiveIndex(cmdPosition)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-4 py-2 text-left transition-colors',
                  isActive
                    ? 'bg-surface-active-alt text-text-primary'
                    : 'text-text-secondary hover:bg-surface-hover',
                )}
              >
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-text-primary">{command.trigger}</span>
                  <span className="text-xs text-text-tertiary">
                    {localize(command.descriptionKey)}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">{localize(command.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </OGDialogContent>
    </OGDialog>
  );
}
