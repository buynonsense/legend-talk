import type { Character } from '../types';

const COLORS = ['blue', 'emerald', 'red', 'purple', 'amber', 'teal', 'orange', 'indigo'];

export function generateCharacter(name: string): Character {
  const trimmed = name.trim();
  const id = 'custom-' + trimmed.toLowerCase().replace(/\s+/g, '-');
  const colorIndex = Math.abs(hashCode(trimmed)) % COLORS.length;

  return {
    id,
    name: { zh: trimmed, en: trimmed },
    era: { zh: '未知', en: 'Unknown' },
    domain: ['custom'],
    avatar: '👤',
    color: COLORS[colorIndex],
    systemPrompt: `Think and respond as ${trimmed} would. Apply their core ideas and thinking framework to analyze problems. Be direct — no pleasantries, jump straight into your perspective.`,
    sampleQuestions: {
      zh: ['你会怎么看这个问题？', '从你的角度，我该怎么做？', '用你的方法分析一下我的处境'],
      en: ['How would you view this problem?', 'From your perspective, what should I do?', 'Analyze my situation using your approach'],
    },
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
