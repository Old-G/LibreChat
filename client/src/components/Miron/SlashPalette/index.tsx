import { useCallback, useState } from 'react';
import { Label, OGDialog, OGDialogTemplate } from '@librechat/client';
import { useChatContext, useChatFormContext } from '~/Providers';
import { useNewConvo, useLocalize } from '~/hooks';
import UsagePanel from '~/components/Miron/UsageFooter/usagePanel';
import Palette from './palette';
import useCommandTrigger from './useCommandTrigger';
import type { MironCommand } from './commands';

interface SlashPaletteHostProps {
  index?: number;
}

export default function SlashPaletteHost({ index = 0 }: SlashPaletteHostProps) {
  const localize = useLocalize();
  const methods = useChatFormContext();
  const { conversation } = useChatContext();
  const { newConversation } = useNewConvo(index);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  useCommandTrigger(paletteOpen, setPaletteOpen);

  const insertIntoInput = useCallback(
    (text: string) => {
      const current = (methods.getValues('text') ?? '') as string;
      const prefix = current.length === 0 ? '' : current.replace(/\s+$/, '') + ' ';
      methods.setValue('text', `${prefix}${text}`, { shouldValidate: true });
    },
    [methods],
  );

  const doNewConversation = useCallback(() => {
    newConversation({ disableFocus: false });
  }, [newConversation]);

  const handleSelect = useCallback(
    (command: MironCommand) => {
      setPaletteOpen(false);
      if (command.action === 'insert' && command.insertText) {
        insertIntoInput(command.insertText);
        return;
      }
      if (command.id === 'usage') {
        setUsageOpen(true);
        return;
      }
      if (command.id === 'new') {
        doNewConversation();
        return;
      }
      if (command.id === 'clear') {
        setConfirmClearOpen(true);
        return;
      }
      if (command.id === 'help') {
        setPaletteOpen(true);
        return;
      }
    },
    [insertIntoInput, doNewConversation],
  );

  return (
    <>
      <Palette open={paletteOpen} onOpenChange={setPaletteOpen} onSelect={handleSelect} />
      <UsagePanel
        open={usageOpen}
        onOpenChange={setUsageOpen}
        conversationId={conversation?.conversationId ?? null}
      />
      <OGDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <OGDialogTemplate
          title={localize('com_miron_palette_cmd_clear_label')}
          className="max-w-[420px]"
          main={
            <div className="flex flex-col gap-2 pt-1">
              <Label className="text-left text-sm font-medium">
                {localize('com_miron_palette_clear_confirm')}
              </Label>
            </div>
          }
          selection={{
            selectHandler: () => {
              setConfirmClearOpen(false);
              doNewConversation();
            },
            selectClasses: 'bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 text-white',
            selectText: localize('com_miron_palette_cmd_clear_label'),
          }}
        />
      </OGDialog>
    </>
  );
}
