# 漫剧AI前端

漫剧AI生成平台的 React 前端应用。

## 技术栈

- React 19 + TypeScript
- Vite 6
- Ant Design 5 + Tailwind CSS 4
- Zustand + TanStack Query
- Framer Motion
- React Markdown

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── api/           # API 客户端封装
├── components/    # 组件
│   ├── chat/      # 聊天相关组件
│   ├── common/    # 通用组件
│   ├── drama/     # 漫剧组件
│   └── workspace/ # 工作区面板
├── hooks/         # 自定义 Hooks
├── pages/         # 页面
├── stores/        # Zustand 状态管理
├── types/         # TypeScript 类型
├── utils/         # 工具函数
└── theme/         # 主题配置
```

## 核心功能

- **流式聊天**: 基于 SSE 的实时消息推送，支持多种消息类型
- **工作区面板**: 实时展示角色、场景、剧本、分镜
- **漫剧管理**: 创建、搜索、收藏漫剧项目
- **用户认证**: 登录、注册、密码重置
