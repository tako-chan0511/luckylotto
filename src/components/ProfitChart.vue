<!-- src/components/ProfitChart.vue -->
<template>
  <v-chart :option="chartOptions" autoresize style="height: 300px;" />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { LottoRecord } from '@/types'
import type { EChartsOption } from 'echarts'
import VChart from 'vue-echarts'
import { useCharts } from '@/composables/useCharts'

const props = defineProps<{ records: LottoRecord[] }>()

// useCharts で日付と収支差を整形
const { seriesData } = useCharts(props.records)

const chartOptions = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', formatter: '{b0}<br/>収支: {c0} 円' },
  xAxis: {
    type: 'category',
    data: seriesData.value.map(item => item[0])
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: val => `${val}円` }
  },
  series: [{
    name: '収支',
    type: 'line',
    data: seriesData.value.map(item => item[1]),
    smooth: true,
    lineStyle: { width: 2 }
  }]
}))
</script>

<style scoped>
/* 必要に応じてチャート周りのスタイルを調整 */
</style>
