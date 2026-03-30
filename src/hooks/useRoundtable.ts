import { useState } from 'react';
import { useConversationStore } from '../stores/conversations';
import { presetCharacters } from '../characters/presets';
import { buildSystemPrompt, resolveProvider, streamResponse, ROUNDTABLE_SUFFIX } from '../utils/prompt';
import i18n from '../i18n';

export function useRoundtable() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<number | null>(null);
  const [totalRounds, setTotalRounds] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(conversationId: string, content: string, rounds: number = 3) {
    const provider = resolveProvider();
    if (!provider) { setError(i18n.t('chat.noApiKey')); return; }

    const conversation = useConversationStore.getState().getConversation(conversationId);
    if (!conversation) return;

    setIsGenerating(true);
    setError(null);
    setTotalRounds(rounds);

    useConversationStore.getState().addMessage(conversationId, 'user', content, undefined);

    try {
      for (let round = 1; round <= rounds; round++) {
        setCurrentRound(round);
        const conv = useConversationStore.getState().getConversation(conversationId)!;

        for (const charId of conv.characters) {
          setCurrentSpeaker(charId);
          const character = presetCharacters.find((c) => c.id === charId);
          if (!character) continue;

          const messages = buildRoundtableMessages(character, conversationId, provider.lang);
          await streamResponse(conversationId, charId, messages, provider);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : i18n.t('common.error', { message: '' }));
    } finally {
      setIsGenerating(false);
      setCurrentSpeaker(null);
      setCurrentRound(null);
    }
  }

  async function regenerate(conversationId: string, characterId: string) {
    const character = presetCharacters.find((c) => c.id === characterId);
    if (!character) return;

    const provider = resolveProvider();
    if (!provider) { setError(i18n.t('chat.noApiKey')); return; }

    setIsGenerating(true);
    setError(null);
    setCurrentSpeaker(characterId);

    try {
      const messages = buildRoundtableMessages(character, conversationId, provider.lang);
      await streamResponse(conversationId, characterId, messages, provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : i18n.t('common.error', { message: '' }));
    } finally {
      setIsGenerating(false);
      setCurrentSpeaker(null);
    }
  }

  return { sendMessage, regenerate, isGenerating, currentSpeaker, currentRound, totalRounds, error };
}

function buildRoundtableMessages(
  character: { id: string; name: Record<string, string>; systemPrompt: string },
  conversationId: string,
  lang: string,
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const conversation = useConversationStore.getState().getConversation(conversationId)!;
  const isMulti = conversation.characters.length > 1;
  const systemPrompt = buildSystemPrompt(character.systemPrompt, lang, isMulti ? ROUNDTABLE_SUFFIX : '');

  const raw: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  for (const msg of conversation.messages) {
    if (msg.role === 'user') {
      raw.push({ role: 'user', content: msg.content });
    } else if (msg.characterId === character.id) {
      raw.push({ role: 'assistant', content: msg.content });
    } else {
      const otherChar = presetCharacters.find((c) => c.id === msg.characterId);
      const name = otherChar
        ? otherChar.name[lang] || otherChar.name.en
        : msg.characterId || 'Unknown';
      raw.push({ role: 'user', content: `[${name}]: ${msg.content}` });
    }
  }

  const merged: typeof raw = [raw[0]];
  for (let i = 1; i < raw.length; i++) {
    const last = merged[merged.length - 1];
    if (raw[i].role === last.role) {
      last.content += '\n\n' + raw[i].content;
    } else {
      merged.push({ ...raw[i] });
    }
  }

  return merged;
}
