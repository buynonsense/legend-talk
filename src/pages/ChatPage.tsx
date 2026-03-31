import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ConversationList } from '../components/ConversationList';
import { ChatView } from '../components/ChatView';
import { CharacterGrid } from '../components/CharacterGrid';
import { useConversationStore } from '../stores/conversations';
import { presetCharacters } from '../characters/presets';
import type { Character } from '../types';

export function ChatPage() {
  const { id } = useParams<{ id?: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createConversation = useConversationStore((s) => s.createConversation);

  const conversation = useConversationStore((s) =>
    id ? s.conversations.find((c) => c.id === id) : undefined,
  );

  const validId = id && conversation ? id : undefined;

  const [roundtableMode, setRoundtableMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleStartChat = (character: Character) => {
    const exists = presetCharacters.find((c) => c.id === character.id);
    if (!exists) presetCharacters.push(character);
    const convId = createConversation('single', [character.id]);
    navigate(`/chat/${convId}`);
  };

  const handleSelect = (character: Character) => {
    setSelectedIds((prev) =>
      prev.includes(character.id)
        ? prev.filter((cid) => cid !== character.id)
        : prev.length < 5
          ? [...prev, character.id]
          : prev,
    );
  };

  const startRoundtable = () => {
    if (selectedIds.length >= 2) {
      const convId = createConversation('roundtable', selectedIds);
      setSelectedIds([]);
      setRoundtableMode(false);
      navigate(`/chat/${convId}`);
    }
  };

  return (
    <div className="flex h-full">
      <ConversationList activeId={validId} />
      <div className="flex-1">
        {validId ? (
          <ChatView conversationId={validId} />
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">{t('home.title')}</h2>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => { setRoundtableMode(false); setSelectedIds([]); }}
                  className={`px-3 py-1 text-sm rounded-lg ${!roundtableMode ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  {t('home.startChat')}
                </button>
                <button
                  onClick={() => setRoundtableMode(true)}
                  className={`px-3 py-1 text-sm rounded-lg ${roundtableMode ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  {t('home.startRoundtable')}
                </button>
              </div>
              {roundtableMode && (
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-sm text-gray-500">{t('roundtable.selected', { count: selectedIds.length })}</span>
                  <button
                    onClick={startRoundtable}
                    disabled={selectedIds.length < 2}
                    className="px-4 py-1.5 text-sm rounded-lg bg-blue-500 text-white disabled:opacity-50"
                  >
                    {t('roundtable.start')}
                  </button>
                </div>
              )}
              <CharacterGrid
                onStartChat={handleStartChat}
                onSelect={handleSelect}
                selectedIds={selectedIds}
                selectable={roundtableMode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
