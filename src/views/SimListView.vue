<template>
  <n-page-header title="シミュレーション セッション一覧" />
  <n-data-table
    :columns="columns"
    :data="sessions"
    :pagination="{ pageSize: 10 }"
    striped
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useSessionStore } from '@/store/useSessionStore'
import type { Session } from '@/types'
import { DataTableColumn } from 'naive-ui'
import { NButton, NDataTable } from 'naive-ui'

// セッションストアを取得
const sessionStore = useSessionStore()

// テーブルに渡すデータ
const sessions = computed<Session[]>(() => sessionStore.sessions)

// テーブルのカラム定義
const columns = [
  {
    title: '日時',
    key: 'date',
    render: (row: Session) => new Date(row.date).toLocaleString()
  },
  {
    title: 'ゲーム',
    key: 'gameType',
    render: (row: Session) =>
      row.gameType === 'numbers4' ? 'ナンバーズ4' : 'ロト6'
  },
  {
    title: '投入合計',
    key: 'totalCost',
    render: (row: Session) =>
      `¥${row.totalCost.toLocaleString()}`
  },
  {
    title: '当選合計',
    key: 'totalPrize',
    render: (row: Session) =>
      `¥${row.totalPrize.toLocaleString()}`
  },
  {
    title: 'ROI',
    key: 'roi',
    render: (row: Session) =>
      `${row.roi.toFixed(1)}%`
  },
  {
    title: '操作',
    key: 'actions',
    render: (row: Session) =>
      h(
        NButton,
        {
          text: true,
          type: 'error',
          size: 'small',
          onClick: () => sessionStore.removeSession(row.id)
        },
        { default: () => '削除' }
      )
  }
] as DataTableColumn<Session>[]
</script>

<style scoped>
.n-page-header {
  margin-bottom: 16px;
}
</style>
