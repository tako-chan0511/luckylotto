<!-- src/views/EntryView.vue -->
<template>
  <div>
    <h3>購入記録を入力</h3>
    <!-- 既存のフォーム -->
    <LottoForm @save="onSaveRecord" />
  </div>
</template>

<script setup lang="ts">
import LottoForm from '@/components/LottoForm.vue'
import { useLottoStore } from '@/store/useLottoStore'

const store = useLottoStore()

// LottoForm から emit された recordData を受け取り、store に登録
function onSaveRecord(recordData: {
  date: string
  type: 'numbers4' | 'lotto6'
  number: string
  count: number
  cost: number
  prize: number
  revenue: number
  comment: string
}) {
  store.add({
    id: Date.now().toString(),
    ...recordData
  })
}
</script>
