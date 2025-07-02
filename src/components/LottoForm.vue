<template>
  <n-form @submit="onSubmit">
    <n-form-item label="日付">
      <n-date-picker v-model:value="date" type="date" />
    </n-form-item>

    <n-form-item label="種類">
      <n-select
        v-model:value="type"
        :options="[
          { label: 'ナンバーズ4', value: 'numbers4' },
          { label: 'ロト6', value: 'loto6' }
        ]"
      />
    </n-form-item>

    <n-form-item label="番号">
      <n-input
        v-model:value="numbers"
        placeholder="例: 1234 または 3-15-22-…"
      />
    </n-form-item>

    <n-form-item label="購入枚数">
      <n-input-number v-model:value="count" :min="1" />
    </n-form-item>

    <n-form-item label="金額（円）">
      <n-input-number v-model:value="cost" :min="0" />
    </n-form-item>

    <n-form-item label="当選額（円）">
      <n-input-number v-model:value="prize" :min="0" />
    </n-form-item>

    <n-form-item label="収支（円）">
      <!-- 読み取り専用 -->
      <n-input-number :value="profit" :disabled="true" />
    </n-form-item>

    <n-form-item label="コメント">
      <n-input v-model:value="comment" placeholder="任意のメモ" />
    </n-form-item>

    <n-button type="primary" native-type="submit">記録</n-button>
  </n-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLottoStore } from '@/store/useLottoStore'
import { nanoid } from 'nanoid'

const store = useLottoStore()

// フォームのモデル
const date    = ref<string>(new Date().toISOString().slice(0,10))
const type    = ref<'numbers4'|'loto6'>('numbers4')
const numbers = ref<string>('')
const count   = ref<number>(1)
const cost    = ref<number>(200)   // デフォルト200円など
const prize   = ref<number>(0)
const comment = ref<string>('')

// 収支は自動計算
const profit = computed(() => prize.value - cost.value)

function onSubmit() {
  store.add({
    id:      nanoid(),
    date:    new Date(date.value).toISOString(),
    type:    type.value,
    numbers: numbers.value,
    count:   count.value,
    cost:    cost.value,
    prize:   prize.value,
    profit:  profit.value,
    comment: comment.value || undefined,
  })
  // フォームをリセット
  numbers.value = ''
  count.value   = 1
  cost.value    = 200
  prize.value   = 0
  comment.value = ''
}
</script>
