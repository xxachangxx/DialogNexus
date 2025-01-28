# Milestone Working Memory Template

## 基本信息
- Milestone版本: v0.4.0
- 分支名称: feature/zustand
- 开始日期: 2025-01-28
- 预计完成日期: 2025-03-28
- 状态: 进行中

## 目标概述
### 主要目标
- [ ] 将现有的React useState状态管理迁移到zustand
- [ ] 优化状态更新逻辑，提高性能
- [ ] 实现更清晰的状态管理架构

### 功能范围
- 核心状态迁移
  - 聊天消息状态 (messages)
  - 系统提示词状态 (systemPrompt)
  - 加载状态 (isLoading)
  - 输入状态 (inputText)
  - 模态框状态 (isModalOpen, isClearConfirmOpen)

- 状态管理优化
  - 实现状态的持久化
  - 添加状态变更的中间件支持
  - 实现状态的选择性订阅
  - 优化状态更新性能

- 技术架构
  - 创建独立的store目录
  - 实现模块化的状态管理
  - 添加TypeScript类型支持
  - 集成开发者工具支持

## 开发日志
### [2025-01-28]
1. UI状态迁移
   - 创建 `src/store/ui.ts` 存放UI相关状态
   - 实现UI状态store (isModalOpen, isClearConfirmOpen, inputText)
   - 在 `useChatHandlers` 中集成UI状态store
   - 保持原有API接口不变，确保组件层面无需修改

2. 聊天核心状态迁移
   - 创建 `src/store/chat.ts` 存放聊天核心状态
   - 实现聊天状态store (messages, systemPrompt, isLoading)
   - 优化消息更新逻辑，添加便捷方法
   - 重构 `useChatHandlers` 以使用新的store
   - 简化流式响应的状态更新逻辑

3. 技术难点解决
   - 流式响应状态更新问题
     - 问题：最初使用函数作用域变量 `currentContent` 累积内容，存在闭包问题
     - 原因：多个token快速到达时，可能基于过期状态更新，导致内容丢失
     - 解决：重构为 `appendToLastMessage`，直接在store层面处理内容追加
     - 优化：使用不可变更新模式 (`slice` + spread)，确保状态更新的可靠性
   - 状态更新策略改进
     - 移除了外部状态依赖，所有状态更新都在store中进行
     - 每次更新都基于最新的state，避免状态不同步
     - 优化了错误处理，改为创建新消息而不是修改现有消息

4. 下一步计划
   - 实现状态持久化
   - 添加开发者工具支持
   - 优化状态更新性能

## 待办事项
### 高优先级
- [ ] 设计store的整体结构
- [ ] 创建核心的chat store
- [ ] 创建UI状态store
- [ ] 重构useChatHandlers.ts

### 待讨论事项
- 是否需要将streaming状态单独管理
- 是否需要实现状态持久化
- 如何处理大量消息历史的性能问题

### 已知问题
- 流式响应可能需要特殊的状态更新策略
- 需要确保状态更新不会影响UI性能

## 相关资源
### 参考文档
- Zustand官方文档: https://docs.pmnd.rs/zustand/getting-started/introduction
- React状态管理最佳实践

### 设计文档
- 现有的useChatHandlers.ts实现
- 项目的整体架构文档

### API文档
- StreamingChatClient接口文档

## 注意事项
- 确保迁移过程中不影响现有功能
- 保持代码的可测试性
- 注意状态更新的性能优化

## 总结
### 经验总结
- 待项目完成后补充

### 改进建议
- 待项目进行中补充 