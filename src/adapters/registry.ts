import type { LLMAdapter } from '../types';
import { OpenAICompatibleAdapter } from './openai-compatible';
import { AnthropicAdapter } from './anthropic';

const adapters: LLMAdapter[] = [
  new OpenAICompatibleAdapter('openai', 'OpenAI', 'https://api.openai.com/v1', [
    { id: 'gpt-5.4', name: 'GPT-5.4' },
    { id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini' },
    { id: 'gpt-5.4-nano', name: 'GPT-5.4 Nano' },
  ], {
    docsUrl: 'https://platform.openai.com/docs/api-reference/chat',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    thinkingStyle: 'reasoning_effort',
  }),

  new AnthropicAdapter(),

  new OpenAICompatibleAdapter('deepseek', 'DeepSeek', 'https://api.deepseek.com', [
    { id: 'deepseek-chat', name: 'DeepSeek Chat' },
    { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
  ], {
    docsUrl: 'https://api-docs.deepseek.com/zh-cn/',
    apiKeyUrl: 'https://platform.deepseek.com/api_keys',
  }),

  new OpenAICompatibleAdapter(
    'volcengine',
    '字节方舟 Coding Plan',
    'https://ark.cn-beijing.volces.com/api/coding/v3',
    [
      { id: 'doubao-seed-2.0-code', name: 'Doubao Seed 2.0 Code' },
      { id: 'doubao-seed-2.0-pro', name: 'Doubao Seed 2.0 Pro' },
      { id: 'doubao-seed-2.0-lite', name: 'Doubao Seed 2.0 Lite' },
      { id: 'doubao-seed-code', name: 'Doubao Seed Code' },
      { id: 'glm-4.7', name: 'GLM-4.7' },
      { id: 'deepseek-v3.2', name: 'DeepSeek V3.2' },
      { id: 'minimax-m2.5', name: 'MiniMax M2.5' },
      { id: 'kimi-k2.5', name: 'Kimi K2.5' },
    ],
    {
      docsUrl: 'https://www.volcengine.com/docs/82379/1928261',
      apiKeyUrl: 'https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey',
    },
  ),

  new OpenAICompatibleAdapter(
    'alibaba',
    '阿里百炼 Coding Plan',
    'https://coding.dashscope.aliyuncs.com/v1',
    [
      { id: 'qwen3.5-plus', name: 'Qwen 3.5 Plus' },
      { id: 'qwen3-coder-plus', name: 'Qwen3 Coder Plus' },
      { id: 'qwen3-coder-next', name: 'Qwen3 Coder Next' },
      { id: 'qwen3-max-2026-01-23', name: 'Qwen3 Max' },
      { id: 'kimi-k2.5', name: 'Kimi K2.5' },
      { id: 'glm-5', name: 'GLM-5' },
      { id: 'glm-4.7', name: 'GLM-4.7' },
      { id: 'MiniMax-M2.5', name: 'MiniMax M2.5' },
    ],
    {
      docsUrl: 'https://help.aliyun.com/zh/model-studio/other-tools-coding-plan',
      apiKeyUrl: 'https://bailian.console.aliyun.com/cn-beijing#/efm/coding-plan-detail',
      thinkingStyle: 'enable_thinking',
    },
  ),

  new OpenAICompatibleAdapter(
    'siliconflow',
    'SiliconFlow',
    'https://api.siliconflow.cn/v1',
    [
      { id: 'deepseek-ai/DeepSeek-V3.2', name: 'DeepSeek V3.2' },
      { id: 'deepseek-ai/DeepSeek-R1', name: 'DeepSeek R1' },
      { id: 'Qwen/Qwen3.5-397B-A17B', name: 'Qwen3.5 397B' },
      { id: 'Qwen/Qwen3-32B', name: 'Qwen3 32B' },
      { id: 'Pro/moonshotai/Kimi-K2.5', name: 'Kimi K2.5 Pro' },
      { id: 'Pro/zai-org/GLM-5', name: 'GLM-5 Pro' },
    ],
    {
      docsUrl: 'https://docs.siliconflow.cn/api-reference/chat-completions/chat-completions',
      apiKeyUrl: 'https://cloud.siliconflow.cn/me/account/ak',
    },
  ),

  new OpenAICompatibleAdapter(
    'groq',
    'Groq',
    'https://api.groq.com/openai/v1',
    [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
      { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
      { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B' },
      { id: 'qwen/qwen3-32b', name: 'Qwen3 32B' },
      { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout 17B' },
    ],
    {
      docsUrl: 'https://console.groq.com/docs/text-chat',
      apiKeyUrl: 'https://console.groq.com/keys',
    },
  ),

  new OpenAICompatibleAdapter(
    'openrouter',
    'OpenRouter',
    'https://openrouter.ai/api/v1',
    [
      { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'NVIDIA: Nemotron 3 Super (free)' },
      { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
      { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash' },
      { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2' },
      { id: 'x-ai/grok-4.1-fast', name: 'Grok 4.1 Fast' },
      { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4' },
      { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B' },
    ],
    {
      docsUrl: 'https://openrouter.ai/models',
      apiKeyUrl: 'https://openrouter.ai/settings/keys',
    },
  ),

  new OpenAICompatibleAdapter(
    'custom',
    'Custom (OpenAI Compatible)',
    '',
    [],
  ),
];

export function getAllAdapters(): LLMAdapter[] {
  return adapters;
}

export function getAdapter(id: string): LLMAdapter | undefined {
  return adapters.find((a) => a.id === id);
}
