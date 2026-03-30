import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../stores/settings';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const toggle = () => {
    const next = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(next);
    setLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
      aria-label="Toggle language"
    >
      {i18n.language.startsWith('zh') ? 'EN' : '中'}
    </button>
  );
}
