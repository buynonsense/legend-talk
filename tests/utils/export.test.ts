import { exportAsMarkdown, exportAsJSON, importFromJSON } from '../../src/utils/export';
import type { Conversation } from '../../src/types';

const mockConversation: Conversation = {
  id: 'conv-1',
  type: 'single',
  characters: ['socrates'],
  messages: [
    { id: 'm1', role: 'user', content: 'What is truth?', timestamp: 1711700000000 },
    {
      id: 'm2',
      role: 'character',
      characterId: 'socrates',
      content: 'What do you mean by truth?',
      timestamp: 1711700010000,
    },
  ],
  createdAt: 1711700000000,
  updatedAt: 1711700010000,
};

describe('exportAsMarkdown', () => {
  it('formats conversation as markdown', () => {
    const md = exportAsMarkdown(mockConversation, { socrates: 'Socrates' });
    expect(md).toContain('# Conversation with Socrates');
    expect(md).toContain('**You:** What is truth?');
    expect(md).toContain('**Socrates:** What do you mean by truth?');
  });
});

describe('exportAsJSON', () => {
  it('returns valid JSON string', () => {
    const json = exportAsJSON(mockConversation);
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe('conv-1');
    expect(parsed.messages).toHaveLength(2);
  });
});

describe('importFromJSON', () => {
  it('parses a valid JSON conversation', () => {
    const json = exportAsJSON(mockConversation);
    const imported = importFromJSON(json);
    expect(imported.id).toBe('conv-1');
    expect(imported.messages).toHaveLength(2);
  });

  it('throws on invalid JSON', () => {
    expect(() => importFromJSON('not json')).toThrow();
  });
});
