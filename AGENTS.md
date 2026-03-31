# AGENTS.md

## 目的
- 本文件面向在本仓库内工作的代理式编码助手。
- 目标是帮助代理快速理解 `legend-talk` 的构建命令、测试方式、代码风格和实现边界。
- 优先遵循现有实现模式，做最小必要修改，不要无根据地引入新工具链或大规模重构。

## 仓库概览
- 技术栈：React 19、TypeScript、Vite 6、Vitest 3、Tailwind CSS v4、Zustand、i18next、React Router 7。
- 应用是纯前端项目，没有后端；所有业务数据保存在浏览器 `localStorage`。
- 路由使用 `createHashRouter`，部署目标是静态托管；不要随意改成服务端路由。
- LLM 调用通过 `src/adapters/` 下的适配器完成，核心抽象是 `AsyncGenerator<string>` 流式输出。
- 中英文双语是核心能力；任何新增文案、角色显示、设置项都要考虑 `zh/en`。

## 目录约定
- `src/components/`：展示组件和较大的视图组件。
- `src/pages/`：路由页面容器。
- `src/hooks/`：异步编排和聊天逻辑，通常返回 `状态 + 动作`。
- `src/stores/`：Zustand store，使用 `persist` 做浏览器持久化。
- `src/adapters/`：不同模型供应商的 API 适配层。
- `src/utils/`：纯工具函数、prompt 拼装、导出逻辑。
- `src/characters/`：预设角色数据和生成逻辑。
- `src/types.ts`：共享领域类型。
- `tests/`：按源码域镜像组织测试文件。

## 构建、预览、测试命令
```bash
# 首次进入仓库
npm install

# 启动开发服务器
npm run dev

# 生产构建；会先跑 TypeScript 检查，再跑 Vite build
npm run build

# 预览生产构建
npm run preview

# 运行全部测试
npm run test

# 监听模式运行测试
npm run test:watch
```

## 单测运行方式
```bash
# 运行单个测试文件
npm run test -- tests/utils/prompt.test.ts

# 运行单个测试文件并按名称过滤单个用例
npm run test -- tests/utils/prompt.test.ts -t 'returns Chinese instruction for "zh"'

# 监听模式运行单个测试文件
npm run test:watch -- tests/hooks/useChat.test.tsx

# 等价的直接命令（仓库已安装 vitest）
npx vitest run tests/utils/prompt.test.ts
npx vitest run tests/utils/prompt.test.ts -t 'returns Chinese instruction for "zh"'
```

## Lint 现状
- 当前仓库没有 `npm run lint`。
- 根目录未发现 ESLint、Prettier、Biome、Stylelint 等显式配置文件。
- 不要在普通需求里顺手引入新的 lint/format 工具链，除非任务明确要求。
- 当前最可靠的静态校验入口是 `npm run build`，因为它会执行 `tsc` 严格类型检查。

## 已确认不存在的代理规则文件
- 除本文件外，仓库当前未发现 `.cursor/rules/`、`.cursorrules`、`.github/copilot-instructions.md`。
- 也未发现其他常见仓库级代理说明文件，如 `CLAUDE.md`、`GEMINI.md`。
- 如果后续新增这些文件，需要将其中规则与本文件合并，并以更具体的仓库规则为准。

## 修改前检查
- 先读相关文件，再动手改。
- 优先做小改动，除非当前任务明确要求重构。
- 先找已有实现再复用，不要顺手做无关清理、批量改格式或大范围重排 import。

## 提交前验证
- 代码修改后至少运行受影响测试。
- 改动涉及类型、构建、路由、适配器或共享类型时，额外运行 `npm run build`。
- 只改某个 hook、store、adapter 或 util 时，优先跑对应单测文件，再视情况补 `npm run build`。
- 如果你写了命令到文档里，尽量亲自跑一遍最关键的命令再声称其可用。

## 导入与模块风格
- 全仓库使用 ESM：只用 `import` / `export`。
- 使用相对路径导入；当前没有路径别名，不要凭空引入 `@/` 风格。
- 常见顺序是：第三方依赖在前，本地模块在后，`import type` 单独声明或放在尾部。
- 现有仓库对 import 排序没有工具强制；保持局部一致即可，不要为了“整理”制造大 diff。
- 副作用导入只放在入口等必要位置，例如 `src/main.tsx` 里的 `./i18n` 和 `./index.css`。

## 格式化约定
- 遵循现有 TypeScript/React 代码风格：2 空格缩进、单引号、语句末尾分号。
- 多行对象、数组、函数参数列表保留尾随逗号；长 `className` 保持可读性，必要时换行。
- 注释尽量少，只在边界情况、流式协议、异常分支等不直观处解释原因。

## TypeScript 约定
- 项目启用了 `strict`、`noUnusedLocals`、`noUnusedParameters`、`noFallthroughCasesInSwitch`。
- 不要使用 `any`，优先补精确类型、联合类型、字面量类型或共享接口。
- 共享领域模型优先放在 `src/types.ts`，不要在各文件里复制同一套结构。
- 组件 props、store state、复杂对象参数优先使用 `interface`；边界处再克制地使用类型断言。
- 不要用 `@ts-ignore`、`eslint-disable` 之类方式跳过问题。

## 命名约定
- React 组件、页面组件、类名使用 PascalCase，例如 `ChatView`、`SharedView`。
- hooks 统一 `useX` 命名，例如 `useChat`、`useRoundtable`。
- store hook 统一 `useXStore` 命名，例如 `useSettingsStore`。
- 事件处理函数使用 `handleX`、`startX`、`finishX` 风格；常量使用全大写或语义化常量名。
- 测试文件使用 `*.test.ts` / `*.test.tsx`，并按源码目录镜像归类。

## React 与组件约定
- 统一使用函数组件。
- props 在函数参数中解构；props 类型通常命名为 `XProps`。
- 页面组件负责路由参数、store 拼装和流程控制；小组件负责展示。
- 样式主要通过 Tailwind 工具类内联到 JSX，不要突然切换到 CSS Modules 或 styled-components。
- 新增交互前先看 `ChatView`、`SettingsView` 现有写法；只有在已有模式不足时才新增 `src/index.css` 级别全局样式。

## Zustand 与状态管理约定
- 全局状态放在 `src/stores/`，通过 Zustand `persist` 持久化到浏览器。
- 组件中优先用 selector 取最小状态切片，避免整仓订阅。
- 需要命令式读写时，可以使用 `useXStore.getState()`；新增 action 保持同步、直接、可预测。
- `persist` 的 storage key 是稳定数据契约，改名要非常谨慎。

## 适配器与流式响应约定
- 新模型供应商优先通过新增 `src/adapters/` 适配器接入，不要把供应商分支散落到组件里。
- 适配器实现要满足 `LLMAdapter` 接口，`chat()` 返回 `AsyncGenerator<string>`。
- 供应商差异应封装在适配器内部；流式消息累计更新遵循 `streamResponse()` 当前模式。
- 自定义 provider 逻辑参考 `resolveProvider()`，尤其是 `customBaseUrl`、CORS 和模型选择。

## 国际化约定
- 组件中优先使用 `useTranslation()` 获取文案。
- 语言判断统一归一化为 `zh` 或 `en`，角色名和文案优先走 `name[lang] || name.en` 回退。
- 新功能若涉及用户可见字符串，应同步考虑中英文，不要只写单语文案。

## 错误处理约定
- 缺配置、缺实体、缺路由参数时，优先早返回，保持分支清晰。
- hooks 中的用户可见失败通常写入本地 `error` 状态，而不是静默忽略。
- 适配器在 HTTP 非 2xx 时应尽量解析响应体并抛出带上下文的 `Error`；不要新增空 `catch`。
- 记录错误时要带上关键上下文，例如 provider、conversationId、messageId 或失败阶段。

## 测试约定
- 测试框架是 Vitest，环境是 `jsdom`，全局 setup 在 `tests/setup.ts`。
- DOM/hook 测试使用 Testing Library，状态变更通常包在 `act()` 里。
- store 测试通常在 `beforeEach` 中重置到 `getInitialState()` 并清空 `localStorage`。
- adapter 测试通过 mock `fetch` 和流式响应验证行为，不依赖真实网络。
- 新测试优先覆盖行为和回归风险，不要只测实现细节。

## 适合复用的现有模式
- 单聊逻辑看 `src/hooks/useChat.ts`。
- 圆桌多轮逻辑看 `src/hooks/useRoundtable.ts`。
- provider 解析、prompt 拼装、流式输出看 `src/utils/prompt.ts`。
- 持久化状态结构看 `src/stores/settings.ts`、`src/stores/conversations.ts`；分享视图与 gzip/base64 解码逻辑看 `src/pages/SharedView.tsx`。

## 不要做的事
- 不要无理由把相对导入改成别名导入。
- 不要新增后端依赖、服务端 API 或数据库假设；这是本地优先的静态前端应用。
- 不要打破 hash 路由、localStorage 持久化或双语支持，也不要在没有明确需求时大改 Tailwind 类名或整体视觉结构。
- 不要为了“规范化”一次性重排整个文件或整个目录。

## 推荐工作流
1. 先读目标模块及其测试。
2. 找相邻实现，复用现有模式。
3. 做最小改动。
4. 运行相关单测；必要时运行 `npm run build`。
5. 只在确认命令和行为后，再在说明里写“已验证”。
