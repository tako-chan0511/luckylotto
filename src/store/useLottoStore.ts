// src/store/useLottoStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LottoRecord } from '@/types'

export const useLottoStore = defineStore('lotto', () => {
  const records = ref<LottoRecord[]>(
    JSON.parse(localStorage.getItem('lottoRecords') || '[]')
  )

  function add(record: LottoRecord) {
    records.value.push(record)
    localStorage.setItem('lottoRecords', JSON.stringify(records.value))
  }

  return { records, add }
})
