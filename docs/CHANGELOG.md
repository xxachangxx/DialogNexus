# Changelog

所有项目的重要变更都将记录在此文件中。本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [Unreleased]

### ✨ 新增
- 实现流式对话功能
  - 集成 OpenAI API
  - 实现流式响应处理
  - 添加打字机效果显示
- 优化消息显示组件
  - 区分不同角色消息样式
  - 调整消息布局和间距
- 优化用户体验
  - 添加消息发送状态指示
  - 优化错误提示展示
  - 改进消息加载动画

### 🛠 技术改进
- 重构消息处理逻辑
  - 优化状态管理
  - 改进错误处理
  - 添加重试机制
- 完善类型定义
  - 区分前端显示消息和API请求消息类型
  - 添加必要的类型注解
- 优化代码结构
  - 抽取公共处理函数
  - 规范化错误处理流程
  - 改进组件复用性
- 优化流式消息处理机制
  - 重构消息累积和渲染机制，提高流式响应处理效率
  - 优化临时消息状态更新方法，确保更精确的内容追加
  - 简化错误消息创建，使用辅助函数增强代码可维护性
  - 移除冗余变量并简化代码逻辑

### 📝 文档
- 添加流式对话实现教程
- 更新项目管理文档
- 完善代码注释和文档说明

## [0.2.0-dev] - 2025-01-22

### 🚧 开发中
### ✨ 新增
- 开始 API 开发工作
  - 初步搭建 API 路由
  - 配置 API 相关功能

### 🛠 技术改进
- 完善后端 API 架构

## [0.1.0-dev] - 2025-01-21

### 🚧 开发中
### ⚠ BREAKING CHANGES
- 项目从 Vite 迁移至 Next.js 框架，不兼容旧版本

### ✨ 新增
- 基础界面框架搭建完成
  - 主体聊天界面布局
  - 消息输入区域
  - 消息显示区域
  - 基础响应式设计

### 🎯 功能
- 实现基础消息功能
  - 消息发送功能
  - 消息编辑功能
  - 消息清除功能
  - 确认对话框

### 🛠 开发体验
- 集成 TypeScript 支持
- 集成 shadcn/ui 组件库
- 集成 Tailwind CSS 样式框架
- 添加快捷键支持
  - Ctrl + Enter 发送消息
  - Ctrl + L 清除消息

## [0.0.1-dev] - 2025-01-21

### 🚧 开发中
### ✨ 新增
- 使用 Create Next App 初始化项目
- 基础项目结构搭建
- 基础依赖配置

[Unreleased]: https://github.com/xxachangxx/DialogNexus/compare/v0.2.0-dev...HEAD
[0.2.0-dev]: https://github.com/xxachangxx/DialogNexus/compare/v0.1.0-dev...v0.2.0-dev
[0.1.0-dev]: https://github.com/xxachangxx/DialogNexus/compare/v0.0.1-dev...v0.1.0-dev
[0.0.1-dev]: https://github.com/xxachangxx/DialogNexus/releases/tag/v0.0.1-dev 