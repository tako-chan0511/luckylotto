// src/store/useLottoStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { LottoRecord } from '@/types'

export const useLottoStore = defineStore('lotto', () => {
  const storageKey = 'lottoRecords'

  // 1) localStorage から復元
  const records = ref<LottoRecord[]>([])
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      records.value = JSON.parse(saved)
      console.log('🗄️ 復元したレコード一覧:', records.value)
    } catch {
      records.value = []
      console.warn('⚠️ ローカルストレージからの復元に失敗しました。初期化します。')
    }
  }

  // 2) records の変更を監視し、自動で localStorage に保存
  watch(
    records,
    (val) => {
      console.log('📦 records が更新されました。現在の配列:', val)
      localStorage.setItem(storageKey, JSON.stringify(val))
    },
    { deep: true }
  )

  /** 新しいレコードを追加（最新が先頭） */
  function add(record: LottoRecord) {
    console.log('▶️ add() に渡された record:', record)
    records.value.unshift(record)
  }

  /** レコードを ID で削除 */
  function removeRecord(id: string) {
    console.log('🗑️ removeRecord() に渡された id:', id)
    records.value = records.value.filter((r) => r.id !== id)
  }

  /** 全レコードをクリア */
  function clearAll() {
    console.log('🧹 clearAll() 実行')
    records.value = []
  }

  return {
    records,
    add,
    removeRecord,
    clearAll
  }
})
