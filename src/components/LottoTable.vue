<template>
  <n-data-table
    :columns="columns"
    :data="records"
    size="small"
    :bordered="true"
    stripe
  >
    <template #body-cell-profit="{ row }">
      <span :class="(row.prize - row.cost) >= 0 ? 'positive' : 'negative'">
        {{ (row.prize - row.cost).toLocaleString() }}円
      </span>
    </template>
  </n-data-table>
</template>

<script setup lang="ts">
import type { LottoRecord } from '@/types'
import { computed, defineProps } from 'vue'
// N を取り除き、正しい名前 'DataTableColumn' をインポート
// type import を推奨します
import type { DataTableColumn } from 'naive-ui' 


const props = defineProps<{ records: LottoRecord[] }>()

// computed の型引数も DataTableColumn に修正
const columns = computed<DataTableColumn<LottoRecord>[]>(() => [
  {
    title: '日付',
    key: 'date',
    // row の型を LottoRecord と明示
    render(row: LottoRecord) { 
      return new Date(row.date).toLocaleDateString()
    }
  },
  { 
    title: '種類', 
    key: 'type', 
    // row の型を LottoRecord と明示
    render: (row: LottoRecord) => row.type === 'numbers4' ? 'ナンバーズ4' : 'ロト6' 
  },
  { 
    title: '投入額', 
    key: 'cost', 
    // row の型を LottoRecord と明示
    render: (row: LottoRecord) => row.cost.toLocaleString() + '円' 
  },
  { 
    title: '当選額', 
    key: 'prize', 
    // row の型を LottoRecord と明示
    render: (row: LottoRecord) => row.prize.toLocaleString() + '円' 
  },
  {
    title: '収支',
    key: 'profit',
    class: 'text-right',
    // カスタムセルスロットを使う (テンプレート側で実装済みのため、ここではこれ以上は不要)
  }
])
</script>

<style scoped>
.positive { color: #2c7; }
.negative { color: #c22; }
.text-right { text-align: right; }
</style>