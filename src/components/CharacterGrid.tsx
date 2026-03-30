import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CharacterCard } from './CharacterCard';
import { presetCharacters } from '../characters/presets';
import { generateCharacter } from '../characters/generator';
import { useSettingsStore } from '../stores/settings';
import type { Character } from '../types';

interface CharacterGridProps {
  onStartChat: (character: Character) => void;
  onSelect?: (character: Character) => void;
  selectedIds?: string[];
  selectable?: boolean;
}

const CATEGORIES = ['all', 'philosophy', 'strategy', 'business', 'psychology', 'science', 'literature', 'art', 'economics', 'politics', 'technology', 'religion', 'education'];

export function CharacterGrid({ onStartChat, onSelect, selectedIds = [], selectable }: CharacterGridProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const favoriteCharacters = useSettingsStore((s) => s.favoriteCharacters);
  const toggleFavorite = useSettingsStore((s) => s.toggleFavorite);

  const filtered = presetCharacters.filter((c) => {
    if (category !== 'all' && !c.domain.includes(category)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.zh.toLowerCase().includes(q) ||
        c.name.en.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aFav = favoriteCharacters.includes(a.id) ? 0 : 1;
    const bFav = favoriteCharacters.includes(b.id) ? 0 : 1;
    return aFav - bFav;
  });

  const handleSearchSubmit = () => {
    if (search && filtered.length === 0) {
      const custom = generateCharacter(search);
      onStartChat(custom);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          placeholder={t('home.search')}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-sm rounded-full ${
              category === cat
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(`home.categories.${cat}`)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((c) => (
          <CharacterCard
            key={c.id}
            character={c}
            onStartChat={onStartChat}
            onSelect={onSelect}
            selected={selectedIds.includes(c.id)}
            selectable={selectable}
            isFavorite={favoriteCharacters.includes(c.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      {search && filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">{t('home.search')}</p>
          <button
            onClick={handleSearchSubmit}
            className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
          >
            {t('home.startChat')} — {search}
          </button>
        </div>
      )}
    </div>
  );
}
