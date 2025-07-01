<template>
  <n-card title="セッション一覧">
    <n-table :data="sessions">
      <thead>
        <tr>
          <th>日時</th>
          <th>ゲーム</th>
          <th>投入合計</th>
          <th>当選合計</th>
          <th>ROI</th>
          <!-- 新規に操作列 -->
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sess in sessions" :key="sess.id">
          <td>{{ sess.date }}</td>
          <td>{{ sess.gameType === 'numbers4' ? 'ナンバーズ4' : 'ロト6' }}</td>
          <td>¥{{ sess.totalCost.toLocaleString() }}</td>
          <td>¥{{ sess.totalPrize.toLocaleString() }}</td>
          <td>{{ sess.roi.toFixed(1) }}%</td>
          <!-- 削除ボタン -->
          <td>
            <n-button size="small" type="error" @click="onDelete(sess.id)">
              削除
            </n-button>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>


<script setup lang="ts">
import { storeToRefs }       from 'pinia'
import dayjs                 from 'dayjs'
import { useSessionStore }   from '@/store/useSessionStore'
import type { Session }      from '@/types'

// ストアからセッション一覧を取得
const sessionStore = useSessionStore()
const { sessions }  = storeToRefs(sessionStore)

// 削除ボタンから呼び出すハンドラ
function onDelete(id: string) {
  sessionStore.removeSession(id)
}
// テーブルの列定義
const columns = [
  {
    title: '日時',
    key:   'date',
    render: (row: Session) => dayjs(row.date).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: 'ゲーム',
    key:   'gameType',
    render: (row: Session) =>
      row.gameType === 'numbers4' ? 'ナンバーズ4' : 'ロト6'
  },
  {
    title: '投入合計',
    key:   'totalCost',
    render: (row: Session) => `¥${row.totalCost.toLocaleString()}`
  },
  {
    title: '当選合計',
    key:   'totalPrize',
    render: (row: Session) => `¥${row.totalPrize.toLocaleString()}`
  },
  {
    title: 'ROI',
    key:   'roi',
    render: (row: Session) => `${row.roi.toFixed(1)}%`
  }
]
</script>

<style scoped>
/* 必要に応じてカードやテーブルの幅調整を */
</style>
