<!-- src/views/StatsView.vue -->
<template>
  <ProfitChart :records="records" />
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLottoStore } from '@/store/useLottoStore'
import ProfitChart from '@/components/ProfitChart.vue'
const store = useLottoStore()
const { records } = storeToRefs(store)
</script>
