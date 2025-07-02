<!-- src/views/RecordEntryView.vue -->
<template>
  <div class="record-entry-view">
    <h3>購入記録入力</h3>
     <n-form label-placement="top" :label-width="100">
      <n-form-item label="日付">
        <n-date-picker v-model:value="date" type="date" clearable />
      </n-form-item>
      <n-form-item label="種類">
        <n-select
          v-model:value="type"
          :options="[
            { label: 'ナンバーズ4', value: 'numbers4' },
            { label: 'ロト6',      value: 'lotto6' }
          ]"
        />
      </n-form-item>
      <n-form-item label="番号">
        <n-input v-model:value="number" placeholder="例: 1234 or 1-2-3-4-5-6" />
      </n-form-item>
      <n-form-item label="購入枚数">
        <n-input-number v-model:value="count" :min="1" />
      </n-form-item>
      <n-form-item label="金額 (円)">
        <n-input-number v-model:value="cost" :min="0" />
      </n-form-item>
      <n-form-item label="当選額 (円)">
        <n-input-number v-model:value="prize" :min="0" />
      </n-form-item>
      <n-form-item label="コメント">
        <n-input v-model:value="comment" type="textarea" placeholder="任意" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSubmit">記録</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLottoStore } from '@/store/useLottoStore'
import { nanoid } from 'nanoid'

// フォームのモデル
const date    = ref<string>(new Date().toISOString().substr(0,10))
const type    = ref<'numbers4'|'lotto6'>('numbers4')
const number  = ref<string>('')
const count   = ref<number>(1)
const cost    = ref<number>(200)
const prize   = ref<number>(0)
const comment = ref<string>('')

// Pinia ストア
const store = useLottoStore()

function onSubmit() {
  console.log('[RecordEntryView] onSubmit called')
  if (!number.value) {
    alert('番号を入力してください')
    return
  }

  // レコードを組み立て
  const rec = {
    id:      nanoid(),
    date:    new Date(date.value).toISOString(),
    type:    type.value,
    number:  number.value,
    count:   count.value,
    cost:    cost.value,
    prize:   prize.value,
    comment: comment.value
  }

  console.log('[RecordEntryView] before add, store.records =', store.records)
  console.log('[RecordEntryView] adding record =', rec)

  store.add({
    id:      nanoid(),
    date:    new Date(date.value).toISOString(),
    type:    type.value,
    number:  number.value,
    count:   count.value,
    cost:    cost.value,
    prize:   prize.value,
    comment: comment.value,
    profit:  prize.value - cost.value,  // ← ここを追加
  })

  console.log('[RecordEntryView] after add, store.records =', store.records)

  // フォームをリセット
  number.value  = ''
  count.value   = 1
  cost.value    = type.value === 'numbers4' ? 200 : 200
  prize.value   = 0
  comment.value = ''

  alert('記録しました')
}
</script>

<style scoped>
.record-entry-view {
  max-width: 600px;
  margin: 0 auto;
}
</style>
