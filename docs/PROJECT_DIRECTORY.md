# DialogNexus 项目目录结构

```
DialogNexus/
├── src/                          # 源代码目录
│   ├── app/                      # Next.js 应用主目录
│   ├── components/               # React 组件
│   ├── hooks/                    # React 自定义 hooks
│   ├── lib/                      # 工具库和配置
│   ├── services/                 # 服务层，处理API调用等
│   └── types/                    # TypeScript 类型定义
├── docs/                         # 项目文档
├── public/                       # 静态资源
├── .next/                        # Next.js 构建输出
└── node_modules/                 # 依赖包
```

## 目录说明

### src/ 源代码目录
- **app/**: Next.js 13+ 应用路由和页面组件
- **components/**: 可复用的 React 组件
  - `ChatBox.tsx`: 聊天界面主组件
- **hooks/**: React 自定义 hooks
  - `useChatHandlers.ts`: 聊天相关的状态和事件处理
  - `chatUtils.ts`: 聊天相关工具函数
- **services/**: 服务层
  - `StreamingChatClient.ts`: 处理流式聊天API通信
    - 基于观察者模式的优化变体实现
    - 提供统一的流式数据处理接口
    - 支持完整的生命周期事件处理
    - 实现多层错误处理机制
- **types/**: TypeScript 类型定义
  - `message.ts`: 消息相关类型定义
- **lib/**: 工具库和配置

### 配置文件
- `package.json`: 项目依赖和脚本配置
- `tsconfig.json`: TypeScript 配置
- `tailwind.config.ts`: Tailwind CSS 配置
- `next.config.ts`: Next.js 配置
- `postcss.config.mjs`: PostCSS 配置
- `eslint.config.mjs`: ESLint 配置

### 其他目录
- `docs/`: 项目文档和更新日志
- `public/`: 静态资源文件
- `.next/`: Next.js 构建输出目录
- `node_modules/`: npm 包依赖目录