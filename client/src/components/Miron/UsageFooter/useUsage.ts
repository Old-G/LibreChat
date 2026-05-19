import { useMemo } from 'react';
import type { TMessage } from 'librechat-data-provider';
import { useGetMessagesByConvoId } from '~/data-provider';
import { estimateCost } from './pricing';

export interface UsageSnapshot {
  promptTokens: number;
  completionTokens: number;
  messageCount: number;
  estimatedCost: number | null;
  model: string | null;
  hasData: boolean;
}

const EMPTY: UsageSnapshot = {
  promptTokens: 0,
  completionTokens: 0,
  messageCount: 0,
  estimatedCost: null,
  model: null,
  hasData: false,
};

const aggregate = (messages: TMessage[] | undefined): UsageSnapshot => {
  if (!messages || messages.length === 0) {
    return EMPTY;
  }
  let prompt = 0;
  let completion = 0;
  let model: string | null = null;
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const tokens = message.tokenCount ?? 0;
    if (message.isCreatedByUser === true) {
      prompt += tokens;
    } else {
      completion += tokens;
      if (!model && message.model) {
        model = message.model;
      }
    }
  }
  return {
    promptTokens: prompt,
    completionTokens: completion,
    messageCount: messages.length,
    estimatedCost: estimateCost(model, prompt, completion),
    model,
    hasData: prompt > 0 || completion > 0,
  };
};

export default function useUsage(conversationId: string | null | undefined): UsageSnapshot {
  const { data } = useGetMessagesByConvoId(conversationId ?? '', {
    enabled: !!conversationId && conversationId !== 'new',
  });
  return useMemo(() => aggregate(data), [data]);
}
