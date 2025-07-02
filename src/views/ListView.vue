<!-- src/views/ListView.vue -->
<template>
  <div>
    <h2>購入記録一覧</h2>

    <!-- 種別切り替え -->
    <n-radio-group v-model:value="filterType" size="small">
      <n-radio-button value="all">全て</n-radio-button>
      <n-radio-button value="numbers4">ナンバーズ4</n-radio-button>
      <n-radio-button value="lotto6">ロト6</n-radio-button>
    </n-radio-group>

    <n-data-table :columns="columns" :data="filteredRecords">
      <template #actions="{ row }">
        <n-button size="tiny" @click="remove(row.id)" text>削除</n-button>
      </template>
    </n-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLottoStore } from '@/store/useLottoStore'
import type { DataTableColumns } from 'naive-ui'
import type { LottoRecord } from '@/types'

const store = useLottoStore()

const filterType = ref<'all'|'numbers4'|'lotto6'>('all')

const filteredRecords = computed(() => {
  return store.records.filter(r =>
    filterType.value === 'all' || r.type === filterType.value
  )
})

// テーブル定義
const columns: DataTableColumns<LottoRecord> = [
  { title: '日付',   key: 'date' },
  { title: '種別',   key: 'type', render: row => row.type === 'numbers4' ? 'ナンバーズ4' : 'ロト6' },
  { title: '番号',   key: 'number' },
  { title: '枚数',   key: 'count' },
  { title: '金額',   key: 'cost', render: row => `¥${row.cost.toLocaleString()}` },
  { title: '当選額', key: 'prize', render: row => `¥${row.prize.toLocaleString()}` },
  { title: '収支',   key: 'revenue', render: row => `¥${row.revenue.toLocaleString()}` },
  { title: 'コメント', key: 'comment' },
  { title: '操作',   key: 'actions', render: 'actions' }
]

function remove(id: string) {
  store.removeRecord(id)
}
</script>
