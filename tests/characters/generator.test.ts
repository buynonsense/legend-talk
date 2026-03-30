import { generateCharacter } from '../../src/characters/generator';

describe('generateCharacter', () => {
  it('generates a character from a name', () => {
    const char = generateCharacter('Elon Musk');
    expect(char.id).toBe('custom-elon-musk');
    expect(char.name.en).toBe('Elon Musk');
    expect(char.name.zh).toBe('Elon Musk');
    expect(char.systemPrompt).toContain('Elon Musk');
    expect(char.domain).toEqual(['custom']);
    expect(char.avatar).toBeTruthy();
    expect(char.color).toBeTruthy();
  });

  it('generates unique ids for different names', () => {
    const a = generateCharacter('Person A');
    const b = generateCharacter('Person B');
    expect(a.id).not.toBe(b.id);
  });

  it('trims and lowercases for id', () => {
    const char = generateCharacter('  Albert Einstein  ');
    expect(char.id).toBe('custom-albert-einstein');
  });
});
