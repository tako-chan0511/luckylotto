<!-- src/components/LottoTable.vue -->
<template>
  <n-data-table
    :columns="columns"
    :data="records"
    size="small"
    :bordered="true"
    stripe
  >
    <template #body-cell-profit="{ row }">
      <span :class="row.prize - row.cost >= 0 ? 'positive' : 'negative'">
        {{ (row.prize - row.cost).toLocaleString() }}円
      </span>
    </template>
  </n-data-table>
</template>

<script setup lang="ts">
import type { LottoRecord } from '@/types'
import { computed, defineProps } from 'vue'
import { NDataTableColumn } from 'naive-ui'

const props = defineProps<{ records: LottoRecord[] }>()

const columns = computed<NDataTableColumn<LottoRecord>[]>(() => [
  {
    title: '日付',
    key: 'date',
    render(row) {
      return new Date(row.date).toLocaleDateString()
    }
  },
  { title: '種類', key: 'type', render: row => row.type === 'numbers4' ? 'ナンバーズ4' : 'ロト6' },
  { title: '投入額', key: 'cost', render: row => row.cost.toLocaleString() + '円' },
  { title: '当選額', key: 'prize', render: row => row.prize.toLocaleString() + '円' },
  {
    title: '収支',
    key: 'profit',
    class: 'text-right',
    // カスタムセルスロットを使う
  }
])
</script>

<style scoped>
.positive { color: #2c7; }
.negative { color: #c22; }
.text-right { text-align: right; }
</style>
