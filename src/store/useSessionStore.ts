// src/store/useSessionStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Session } from '@/types'

export const useSessionStore = defineStore('session', () => {
  const storageKey = 'lucky-lotto-sessions'
  // セッション一覧を保持
  const sessions = ref<Session[]>([])

  // localStorage から復元
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      sessions.value = JSON.parse(saved)
    } catch {
      sessions.value = []
    }
  }

  // sessions が変更されるたびに localStorage に保存
  watch(
    sessions,
    (current) => {
      localStorage.setItem(storageKey, JSON.stringify(current))
    },
    { deep: true }
  )

  /** 新しいセッションを追加 */
  function addSession(session: Session) {
    // 一覧は最新が上にくるよう先頭に挿入
    sessions.value.unshift(session)
  }

  /** セッションを削除 */
  function removeSession(id: string) {
    sessions.value = sessions.value.filter(s => s.id !== id)
  }

  return { sessions, addSession, removeSession }
})
