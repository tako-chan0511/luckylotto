<!-- src/components/LottoForm.vue -->
<template>
  <n-form @submit="onSubmit">
    <n-form-item label="日付">
      <n-date-picker v-model="date" type="date" />
    </n-form-item>
    <n-form-item label="種類">
      <n-select v-model="type" :options="typeOptions"/>
    </n-form-item>
    <n-form-item label="当選額">
      <n-input-number v-model:value="prize" :min="0" />
    </n-form-item>
    <n-button type="primary" native-type="submit">記録</n-button>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLottoStore } from '@/store/useLottoStore'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

const store = useLottoStore()
const date  = ref(dayjs().format('YYYY-MM-DD'))
const type  = ref<'numbers4'|'lotto6'>('numbers4')
const prize = ref(0)

const typeOptions = [
  { label: 'ナンバーズ4', value: 'numbers4' },
  { label: 'ロト6',     value: 'lotto6' },
]

function onSubmit() {
  store.add({
    id:     nanoid(),
    date:   dayjs(date.value).toISOString(),
    type:   type.value,
    cost:   2000,
    prize:  prize.value,
  })
  prize.value = 0
}
</script>
