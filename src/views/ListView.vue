<!-- src/views/ListView.vue -->
<template>
  <LottoTable :records="records" />
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLottoStore } from '@/store/useLottoStore'
import LottoTable from '@/components/LottoTable.vue'

const store = useLottoStore()
const { records } = storeToRefs(store)
</script>
