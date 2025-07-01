<template>
  <div class="lotto6-game">
    <h3>ロト6（1枚 ¥200）</h3>

    <!-- エントリーフォーム -->
    <div class="entry-form">
      <label>
        予想番号:
        <div class="numbers-input">
          <input
            v-for="(num, idx) in guesses"
            :key="idx"
            type="number"
            v-model.number="guesses[idx]"
            :min="1"
            :max="43"
            placeholder="--"
          />
        </div>
      </label>
      <label class="count">
        枚数:
        <input type="number" min="1" v-model.number="ticketCount" /> 枚
      </label>
      <button type="button" @click="addToQueue" :disabled="!isValid">
        追加
      </button>
    </div>

    <!-- キュー一覧 -->
    <div v-if="queue.length" class="queue-table">
      <h4>エントリ一覧</h4>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>予想</th>
            <th>枚数</th>
            <th>コスト</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in queue" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.guess.join(' - ') }}</td>
            <td>{{ item.count }}</td>
            <td>¥{{ (item.count * 200).toLocaleString() }}</td>
            <td><button @click="removeFromQueue(idx)">✕</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 抽選実行 -->
    <button
      type="button"
      class="draw-button"
      :disabled="!queue.length"
      @click="executeDraw"
    >
      抽選実行
    </button>

    <!-- 結果表示 -->
    <div v-if="drawn.length" class="result">
      <h4>当せん番号：{{ drawn.join(' - ') }}</h4>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>予想</th>
            <th>枚数</th>
            <th>一致数</th>
            <th>当せん額/枚</th>
            <th>当せん合計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in results" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ r.guess.join(' - ') }}</td>
            <td>{{ r.count }}</td>
            <td>{{ r.matchCount }}</td>
            <td>¥{{ r.prizePerTicket.toLocaleString() }}</td>
            <td>¥{{ (r.prizePerTicket * r.count).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
      <p class="summary">
        投入合計：¥{{ totalCost.toLocaleString() }}
        　当せん合計：¥{{ totalPrize.toLocaleString() }}
        　収支：¥{{ (totalPrize - totalCost).toLocaleString() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Lotto6Entry, Lotto6Result } from '@/types'

// --- 抽選ロジック ---
function generateDraw(): number[] {
  const pool = Array.from({ length: 43 }, (_, i) => i + 1)
  const result: number[] = []
  while (result.length < 6) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result.sort((a, b) => a - b)
}

// 一致数を数える
function calcMatchCount(guess: number[], draw: number[]): number {
  return guess.filter(g => draw.includes(g)).length
}

// 当せん額/枚を返す
function calcPrize(matches: number): number {
  switch (matches) {
    case 6: return 10_000_000
    case 5: return   100_000
    case 4: return    10_000
    case 3: return     1_000
    default: return         0
  }
}

// --- component state ---
const guesses = ref<number[]>([0, 0, 0, 0, 0, 0])
const ticketCount = ref(1)
const queue = ref<Lotto6Entry[]>([])

const isValid = computed(() =>
  guesses.value.every(n => n >= 1 && n <= 43) &&
  new Set(guesses.value).size === 6 &&
  ticketCount.value > 0
)

function addToQueue() {
  if (!isValid.value) return
  queue.value.push({
    guess: [...guesses.value].sort((a, b) => a - b),
    count: ticketCount.value
  })
}
function removeFromQueue(idx: number) {
  queue.value.splice(idx, 1)
}

const drawn = ref<number[]>([])
const results = ref<Lotto6Result[]>([])

function executeDraw() {
  drawn.value = generateDraw()
  results.value = queue.value.map(item => {
    const matchCount = calcMatchCount(item.guess, drawn.value)
    const prizePerTicket = calcPrize(matchCount)
    return { ...item, matchCount, prizePerTicket }
  })
}

const totalCost = computed(() =>
  queue.value.reduce((sum, e) => sum + e.count * 200, 0)
)
const totalPrize = computed(() =>
  results.value.reduce((sum, r) => sum + r.prizePerTicket * r.count, 0)
)
</script>

<style scoped>
.lotto6-game {
  font-family: sans-serif;
  max-width: 600px;
}
.entry-form {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.numbers-input input {
  width: 3em;
  margin-right: 4px;
}
.queue-table,
.result table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}
.queue-table th,
.queue-table td,
.result th,
.result td {
  border: 1px solid #ccc;
  padding: 4px 8px;
  text-align: center;
}
.draw-button {
  margin-top: 12px;
  padding: 6px 16px;
}
.result {
  margin-top: 16px;
  background: #f7f7f7;
  padding: 12px;
  border-radius: 6px;
}
.summary {
  margin-top: 8px;
  font-weight: bold;
}
</style>
