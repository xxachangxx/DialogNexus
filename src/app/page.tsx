'use client';

import { redirect } from 'next/navigation';
import { useSessionStore } from '@/store/session';
import { DEFAULT_SESSION } from '@/store/session';

export default function Home() {
  const { sessions, addSession} = useSessionStore();

  // 获取第一个session的ID
  let firstSessionId = Array.from(sessions.keys())[0];

  // 如果当前没有session，则创建默认session
  if (sessions.size === 0) {
    const newSession = {...DEFAULT_SESSION}
    const newSessionId = addSession(newSession)
    firstSessionId = newSessionId
  }

  // 重定向到第一个session
  redirect(`/chat/${firstSessionId}`);

  return null;
}