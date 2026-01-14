<template>
  <v-chart :option="chartOptions" autoresize style="height: 300px;" />
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue'
import type { LottoRecord } from '@/types' // '@/types' からLottoRecordをインポート
import type { EChartsOption } from 'echarts'
import VChart from 'vue-echarts'
import { useCharts } from '@/composables/useCharts' // useChartsフックをインポート

// SeriesDataItem インターフェースは useCharts から返される seriesData の型を定義します
// useCharts の中で SeriesDataItem の配列を返すことを想定しています
interface SeriesDataItem {
  name: string;
  value: (string | number)[]; // `value` が配列であることを明示
}

// props の型定義。LottoRecord の配列を受け取ります。
const props = defineProps<{ records: LottoRecord[] }>()

// useCharts フックから seriesData を取得します。
// ここで seriesData を ref で再度宣言してはいけません。useChartsがrefを返します。
const { seriesData } = useCharts(props.records); // <-- ここはそのまま

// チャートのオプションを計算する computed プロパティ
// option と chartOptions が重複していたため、chartOptions に統一します。
const chartOptions = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', formatter: '{b0}<br/>収支: {c0} 円' },
  xAxis: {
    type: 'category',
    // `seriesData.value.map` の引数 `item` に型を明示
    // `item` は `SeriesDataItem` 型で、その `value` プロパティが配列です。
    // `item.value[0]` のようにアクセスします。
    data: seriesData.value.map((item: SeriesDataItem) => item.value[0]) // <-- ここを修正
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: val => `${val}円` }
  },
  series: [{
    name: '収支',
    type: 'line',
    // `seriesData.value.map` の引数 `item` に型を明示
    // `item` は `SeriesDataItem` 型で、その `value` プロパティが配列です。
    // `item.value[1]` のようにアクセスします。
    data: seriesData.value.map((item: SeriesDataItem) => item.value[1]), // <-- ここを修正
    smooth: true,
    lineStyle: { width: 2 }
  }]
}));

// 「const option = computed(() => ({...}));」のブロックは
// chartOptions と内容が重複しているため、削除します。
// テンプレートで chartOptions を使用しているので不要です。
</script>

<style scoped>
/* 必要に応じてチャート周りのスタイルを調整 */
</style>