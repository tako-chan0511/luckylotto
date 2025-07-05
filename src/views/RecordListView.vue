<!-- src/views/RecordListView.vue -->
<template>
  <div class="record-list-view">
    <h3>購入記録 一覧</h3>
    <n-data-table
      :columns="columns"
      :data="tableData"
      size="small"
      striped
      bordered
    >
      <template #bodyCell="{ row, column }">
        <span v-if="column.key === 'date'">
          {{ new Date(row.date).toLocaleString() }}
        </span>
        <span v-else-if="column.key === 'type'">
          {{ row.type === "numbers4" ? "ナンバーズ4" : "ロト6" }}
        </span>
        <span v-else-if="column.key === 'profit'">
          ¥{{ row.profit.toLocaleString() }}
        </span>
        <span v-else>
          {{ row[column.key] }}
        </span>
      </template>
    </n-data-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLottoStore } from "@/store/useLottoStore";
import type { DataTableColumns } from "naive-ui";
import dayjs from "dayjs";

const store = useLottoStore();

// テーブルに渡すデータを整形
const tableData = computed(() =>
  store.records.map((r) => ({
    ...r,
    // dayjs で YYYY-MM-DD に整形
    date: dayjs(r.date).format("YYYY-MM-DD"),
    // profit（収支）を計算しておく
    profit: (r.prize || 0) - (r.cost || 0),
  }))
);

// 列定義
const columns = <DataTableColumns<(typeof tableData.value)[0]>>[
  { title: "日付", key: "date" },
  { title: "種類", key: "type" },
  { title: "番号", key: "number" },
  { title: "枚数", key: "count" },
  { title: "金額 (円)", key: "cost" },
  { title: "当選額 (円)", key: "prize" },
  { title: "収支 (円)", key: "profit" },
  { title: "コメント", key: "comment" },
];

// 日付を「YYYY-MM-DD」形式に整形したデータを用意
const formattedRecords = computed(() =>
  store.records.map((r) => ({
    ...r,
    date: dayjs(r.date).format("YYYY-MM-DD"),
  }))
);
</script>

<style scoped>
.record-list-view {
  max-width: 900px;
  margin: 0 auto;
}
</style>
