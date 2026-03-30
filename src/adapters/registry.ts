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
    '字节方舟 (Volcengine)',
    'https://ark.cn-beijing.volces.com/api/v3',
    [
      { id: 'doubao-seed-2-0-pro-260215', name: 'Doubao Seed 2.0 Pro' },
      { id: 'doubao-1.5-pro-32k', name: 'Doubao 1.5 Pro 32K' },
      { id: 'doubao-1.5-pro-256k', name: 'Doubao 1.5 Pro 256K' },
      { id: 'doubao-1.5-thinking-pro', name: 'Doubao 1.5 Thinking Pro' },
      { id: 'doubao-pro-32k', name: 'Doubao Pro 32K' },
      { id: 'doubao-lite-32k', name: 'Doubao Lite 32K' },
      { id: 'deepseek-r1', name: 'DeepSeek R1' },
      { id: 'deepseek-v3', name: 'DeepSeek V3' },
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
      { id: 'kimi-k2.5', name: 'Kimi K2.5' },
      { id: 'glm-5', name: 'GLM-5' },
      { id: 'MiniMax-M2.5', name: 'MiniMax M2.5' },
      { id: 'qwen3-coder-plus', name: 'Qwen3 Coder Plus' },
      { id: 'qwen3-coder-next', name: 'Qwen3 Coder Next' },
    ],
    {
      docsUrl: 'https://help.aliyun.com/zh/model-studio/other-tools-coding-plan',
      apiKeyUrl: 'https://bailian.console.aliyun.com/cn-beijing#/efm/coding-plan-detail',
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
