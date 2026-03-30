import { useState } from 'react';
import { useConversationStore } from '../stores/conversations';
import { presetCharacters } from '../characters/presets';
import { buildSystemPrompt, resolveProvider, streamResponse } from '../utils/prompt';
import i18n from '../i18n';

export function useChat() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function buildMessages(conversationId: string, characterPrompt: string, lang: string) {
    const conv = useConversationStore.getState().getConversation(conversationId)!;
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: buildSystemPrompt(characterPrompt, lang) },
    ];
    for (const msg of conv.messages) {
      messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
    }
    return messages;
  }

  async function generate(conversationId: string, addUserMessage?: string) {
    const conversation = useConversationStore.getState().getConversation(conversationId);
    if (!conversation) return;

    const characterId = conversation.characters[0];
    const character = presetCharacters.find((c) => c.id === characterId);
    if (!character) return;

    const provider = resolveProvider();
    if (!provider) { setError(i18n.t('chat.noApiKey')); return; }

    setIsGenerating(true);
    setError(null);

    if (addUserMessage) {
      useConversationStore.getState().addMessage(conversationId, 'user', addUserMessage, undefined);
    }

    try {
      const messages = buildMessages(conversationId, character.systemPrompt, provider.lang);
      await streamResponse(conversationId, characterId, messages, provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : i18n.t('common.error', { message: '' }));
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    sendMessage: (conversationId: string, content: string) => generate(conversationId, content),
    regenerate: (conversationId: string) => generate(conversationId),
    isGenerating,
    error,
  };
}
