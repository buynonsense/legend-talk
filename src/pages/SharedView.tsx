import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageBubble } from '../components/MessageBubble';
import { presetCharacters } from '../characters/presets';

interface SharedMessage {
  role: 'user' | 'character';
  characterId?: string;
  content: string;
}

interface SharedData {
  title?: string;
  characters: string[];
  messages: SharedMessage[];
}

async function decompressData(base64: string): Promise<SharedData> {
  const padded = base64.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - base64.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  const json = new TextDecoder().decode(result);
  return JSON.parse(json);
}

export function SharedView() {
  const { data } = useParams<{ data: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const [shared, setShared] = useState<SharedData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!data) return;
    decompressData(data)
      .then(setShared)
      .catch(() => setError('Failed to decode shared conversation'));
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-500">{error}</p>
        <Link
          to="/chat"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          {t('shared.startOwn')}
        </Link>
      </div>
    );
  }

  if (!shared) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  const characters = shared.characters
    .map((id) => presetCharacters.find((c) => c.id === id))
    .filter(Boolean) as NonNullable<ReturnType<typeof presetCharacters.find>>[];

  const isMulti = characters.length > 1;

  const displayTitle = shared.title
    || characters.map((c) => c.name[lang] || c.name.en).join(', ')
    || t('shared.title');

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold">{displayTitle}</h2>
        <p className="text-xs text-gray-400">{t('shared.title')}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4">
        {shared.messages.map((msg, idx) => {
          const msgChar = msg.characterId
            ? presetCharacters.find((c) => c.id === msg.characterId)
            : undefined;
          return (
            <MessageBubble
              key={idx}
              content={msg.content}
              isUser={msg.role === 'user'}
              avatar={msgChar?.avatar}
              color={msgChar?.color}
              name={isMulti && msgChar ? (msgChar.name[lang] || msgChar.name.en) : undefined}
            />
          );
        })}
      </div>

      <div className="flex justify-center px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/chat"
          className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium"
        >
          {t('shared.startOwn')}
        </Link>
      </div>
    </div>
  );
}
