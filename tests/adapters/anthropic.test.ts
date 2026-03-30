import { AnthropicAdapter } from '../../src/adapters/anthropic';

function mockFetchStream(chunks: string[]) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
  return vi.fn().mockResolvedValue({ ok: true, body: stream });
}

describe('AnthropicAdapter', () => {
  const adapter = new AnthropicAdapter();

  it('has correct metadata', () => {
    expect(adapter.id).toBe('anthropic');
    expect(adapter.name).toBe('Anthropic');
    expect(adapter.models.length).toBeGreaterThan(0);
  });

  it('extracts system message and streams response', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetchStream([
      'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}\n\n',
      'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":" there"}}\n\n',
      'event: message_stop\ndata: {"type":"message_stop"}\n\n',
    ]);

    const tokens: string[] = [];
    for await (const token of adapter.chat({
      messages: [
        { role: 'system', content: 'You are helpful' },
        { role: 'user', content: 'hi' },
      ],
      model: 'claude-sonnet-4-20250514',
      apiKey: 'sk-ant-test',
    })) {
      tokens.push(token);
    }
    expect(tokens).toEqual(['Hello', ' there']);

    const callBody = JSON.parse(
      (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body,
    );
    expect(callBody.system).toBe('You are helpful');
    expect(callBody.messages).toEqual([{ role: 'user', content: 'hi' }]);

    globalThis.fetch = originalFetch;
  });

  it('sends correct headers', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetchStream([
      'event: message_stop\ndata: {"type":"message_stop"}\n\n',
    ]);

    for await (const _ of adapter.chat({
      messages: [{ role: 'user', content: 'hi' }],
      model: 'claude-sonnet-4-20250514',
      apiKey: 'sk-ant-test',
    })) {
      // consume
    }

    const callHeaders = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers;
    expect(callHeaders['x-api-key']).toBe('sk-ant-test');
    expect(callHeaders['anthropic-version']).toBe('2023-06-01');
    expect(callHeaders['anthropic-dangerous-direct-browser-access']).toBe('true');

    globalThis.fetch = originalFetch;
  });
});
