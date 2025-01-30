import { ClientDisplayMessage } from "@/types/message";


type CreateMessageParams = {
  role: ClientDisplayMessage["role"];
  content: string;
  /** 允许手动指定创建时间（主要用于测试） */
  createdAt?: Date;
};

/**
 * 生成唯一的消息ID
 * @returns {string} 基于时间戳和随机字符串的唯一ID
 */
export const generateMsgId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/**
 * 生成唯一的会话ID
 * 该方法通过以下方式生成较短的唯一ID：
 * 1. 使用Date.now()获取当前时间戳
 * 2. 将时间戳转换为36进制字符串并取最后4位
 * 3. 生成随机数并转换为36进制字符串，取第2到第6位
 * 4. 将两部分拼接，生成8-10位的混合字符串
 * 相比generateMsgId，该方法生成的ID更短，适合作为会话ID
 * @returns {string} 基于时间戳和随机字符串的唯一ID
 */
export const generateSessionId = () =>
  `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 6)}`;



/**
 * 创建一个新的消息对象
 * @param {CreateMessageParams} params - 创建消息的参数
 * @returns {ClientDisplayMessage} 创建的消息对象
 */
const createMessage = ({
  role,
  content,
  createdAt = new Date()
}: CreateMessageParams): ClientDisplayMessage => ({
  id: generateMsgId(),
  role,
  content,
  createdAt
});

/**
 * 创建一个系统消息
 * @param {string} content - 系统消息的内容
 * @returns {ClientDisplayMessage} 系统消息对象
 */
export const createSystemMessage = (content: string) =>
  createMessage({ role: "system", content });

/**
 * 创建一个用户消息
 * @param {string} content - 用户消息的内容
 * @returns {ClientDisplayMessage} 用户消息对象
 */
export const createUserMessage = (content: string) =>
  createMessage({ role: "user", content });

/**
 * 创建一个助手消息
 * @param {string} content - 助手消息的内容
 * @returns {ClientDisplayMessage} 助手消息对象
 */
export const createAssistantMessage = (content: string) =>
  createMessage({ role: "assistant", content });
