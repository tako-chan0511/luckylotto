<template>
  <n-config-provider>
    <n-space vertical>
      <h3>シミュレーション セッション収支推移</h3>
      <v-chart
        :option="option"
        autoresize
        style="height:400px; width:100%;"
      />
    </n-space>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'

// レンダラー＆チャート＆コンポーネント
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
])

import type { EChartsOption } from 'echarts'
import { useSessionStore } from '@/store/useSessionStore'

// ストア＆生データ（日付順：古→新）
const store = useSessionStore()
const sessions = computed(() =>
  [...store.sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
)

// 1回ごとの損益
const oneOffAll = computed(() =>
  sessions.value.map(s => s.totalPrize - s.totalCost)
)
const oneOff4 = computed(() =>
  sessions.value.map(s =>
    s.gameType === 'numbers4' ? s.totalPrize - s.totalCost : 0
  )
)
const oneOff6 = computed(() =>
  sessions.value.map(s =>
    s.gameType === 'lotto6' ? s.totalPrize - s.totalCost : 0
  )
)
// 累積に変換
function toCumulative(arr: number[]) {
  let sum = 0
  return arr.map(v => (sum += v))
}
const cumAll = computed(() => toCumulative(oneOffAll.value))
const cum4   = computed(() => toCumulative(oneOff4.value))
const cum6   = computed(() => toCumulative(oneOff6.value))

// 投資額／X軸
const invest = computed(() => sessions.value.map(s => s.totalCost))
const xData  = computed(() => sessions.value.map((_, i) => i + 1))

// チャートオプション
const option = computed<EChartsOption>(() => ({
  title: { text: 'シミュレーション セッション収支推移', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: {
    top: 30,
    data: ['投入額', '累積収支(ALL)', '累積収支(N4)', '累積収支(L6)']
  },
  toolbox: { feature: { saveAsImage: {} }, right: 20 },
  xAxis: {
    type: 'category',
    name: 'セッション',
    data: xData.value
  },
  yAxis: {
    type: 'value',
    name: '金額 (円)',
     axisLabel: {
      formatter: (value: number) => `¥${value.toLocaleString()}`
    },
    min: () => Math.min(...invest.value, ...cumAll.value) * 1.1,
    max: () => Math.max(...invest.value, ...cumAll.value) * 1.1
  },
  series: [
    {
      name: '投入額',
      type: 'bar',
      data: invest.value,
      itemStyle: { color: '#888' }
    },
    {
      name: '累積収支(ALL)',
      type: 'line',
      data: cumAll.value,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, type: 'dashed' }
    },
    {
      name: '累積収支(N4)',
      type: 'line',
      data: cum4.value,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2 }
    },
    {
      name: '累積収支(L6)',
      type: 'line',
      data: cum6.value,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2 }
    }
  ]
}))
</script>

<style scoped>
h3 {
  margin-bottom: 16px;
}
</style>
