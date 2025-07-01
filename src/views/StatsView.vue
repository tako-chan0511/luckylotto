<!-- src/views/StatsView.vue -->
<template>
  <v-chart
    :option="chartOptions"
    autoresize
    style="height: 360px; width: 100%;" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'

// チャート本体
import { LineChart, BarChart } from 'echarts/charts'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'


import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  SVGRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent
])

import type { EChartsOption } from 'echarts'
import { useSessionStore } from '@/store/useSessionStore'

const sessionStore = useSessionStore()
const sessions = computed(() =>
  [...sessionStore.sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
)

// セッションごとの累積収支（ナンバーズ4）
const cumN4 = computed<number[]>(() => {
  let sum = 0
  return sessions.value.map(s => {
    if (s.gameType === 'numbers4') {
      sum += (s.totalPrize - s.totalCost)
    }
    return sum
  })
})
// セッションごとの累積収支（ロト6）
const cumL6 = computed<number[]>(() => {
  let sum = 0
  return sessions.value.map(s => {
    if (s.gameType === 'lotto6') {
      sum += (s.totalPrize - s.totalCost)
    }
    return sum
  })
})
// 合計累積
const cumAll = computed<number[]>(() =>
  cumN4.value.map((v, i) => v + cumL6.value[i])
)
// セッションごとの投入金額
const invest = computed<number[]>(() =>
  sessions.value.map(s => s.totalCost)
)
// Xラベル：セッション番号
const xLabels = computed<string[]>(() =>
  sessions.value.map((_, i) => String(i + 1))
)

const chartOptions = computed<EChartsOption>(() => ({
  title: {
    text: 'セッション別累積収支＆投資金額',
    left: 'center',
    top: 8
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: (params: any) =>
      params.map((p: any) =>
        `${p.marker}${p.seriesName}：¥${p.data.toLocaleString()}`
      ).join('<br/>')
  },
  legend: {
    top: 30,
    data: ['投資金額','ナンバーズ4','ロト6','合計']
  },
  xAxis: {
    type: 'category',
    data: xLabels.value,
    name: 'セッション',
    boundaryGap: true
  },
  yAxis: {
    type: 'value',
    name: '金額 (円)',
    // データ範囲に合わせて自動設定
    min: 'dataMin',
    max: 'dataMax',
    axisLabel: { formatter: (v: number) => `¥${v.toLocaleString()}` },
    splitLine: { show: true }
  },
  series: [
    {
      name: '投資金額',
      type: 'bar',
      data: invest.value,
      barWidth: '40%',
      itemStyle: { color: '#5470C6' }
    },
    {
      name: 'ナンバーズ4',
      type: 'line',
      data: cumN4.value,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2 }
    },
    {
      name: 'ロト6',
      type: 'line',
      data: cumL6.value,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color: '#73C0DE' }
    },
    {
      name: '合計',
      type: 'line',
      data: cumAll.value,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, type: 'dashed', color: '#FAC858' }
    }
  ],
  grid: {
    left: '6%',
    right: '6%',
    bottom: '12%',
    containLabel: true
  },
  toolbox: {
    feature: { saveAsImage: {} },
    right: 20
  }
}))
</script>

<style scoped>
/* 必要に応じて微調整 */
</style>
