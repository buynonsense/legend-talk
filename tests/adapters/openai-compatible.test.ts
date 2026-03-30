import { OpenAICompatibleAdapter } from '../../src/adapters/openai-compatible';

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
  return vi.fn().mockResolvedValue({
    ok: true,
    body: stream,
  });
}

describe('OpenAICompatibleAdapter', () => {
  const adapter = new OpenAICompatibleAdapter(
    'test-provider',
    'Test Provider',
    'https://api.test.com/v1',
    [{ id: 'test-model', name: 'Test Model' }],
  );

  it('has correct metadata', () => {
    expect(adapter.id).toBe('test-provider');
    expect(adapter.name).toBe('Test Provider');
    expect(adapter.models).toHaveLength(1);
    expect(adapter.models[0].id).toBe('test-model');
  });

  it('streams chat response tokens', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetchStream([
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" world"}}]}\n\n',
      'data: [DONE]\n\n',
    ]);

    const tokens: string[] = [];
    for await (const token of adapter.chat({
      messages: [{ role: 'user', content: 'hi' }],
      model: 'test-model',
      apiKey: 'sk-test',
    })) {
      tokens.push(token);
    }
    expect(tokens).toEqual(['Hello', ' world']);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.test.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-test',
        }),
      }),
    );

    globalThis.fetch = originalFetch;
  });

  it('uses CORS proxy when provided', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetchStream([
      'data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n',
    ]);

    const tokens: string[] = [];
    for await (const token of adapter.chat({
      messages: [{ role: 'user', content: 'hi' }],
      model: 'test-model',
      apiKey: 'sk-test',
      corsProxy: 'https://proxy.example.com',
    })) {
      tokens.push(token);
    }

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://proxy.example.com/https://api.test.com/v1/chat/completions',
      expect.anything(),
    );

    globalThis.fetch = originalFetch;
  });

  it('throws on non-ok response', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    const gen = adapter.chat({
      messages: [{ role: 'user', content: 'hi' }],
      model: 'test-model',
      apiKey: 'bad-key',
    });
    await expect(gen.next()).rejects.toThrow('Unauthorized');

    globalThis.fetch = originalFetch;
  });
});
