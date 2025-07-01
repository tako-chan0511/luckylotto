<template>
  <div class="numbers4-game">
    <h3>ナンバーズ4（1枚 ¥200）</h3>

    <!-- ① 一気に4桁入力と自動選択 -->
    <div class="entry-form">
      <button type="button" @click="autoPick4" class="auto-button">お任せで選択</button>
      <label>
        買い方：
        <select v-model="purchaseType">
          <option value="straight">ストレート</option>
          <option value="box">ボックス</option>
          <option value="set">セット</option>
        </select>
      </label>
      <label>
        予想番号：
        <input
          type="text"
          v-model="guessInput"
          maxlength="4"
          placeholder="例: 1234"
          @input="onGuessInput"
        />
      </label>
      <label class="count">
        枚数：
        <input type="number" min="1" v-model.number="ticketCount" /> 枚
      </label>
      <button type="button" @click="addToQueue" :disabled="!isGuessValid">
        追加
      </button>
    </div>

    <!-- ② キュー一覧 -->
    <div v-if="queue.length" class="queue-table">
      <h4>エントリ一覧</h4>
      <table>
        <thead>
          <tr>
            <th>買い方</th>
            <th>#</th>
            <th>予想</th>
            <th>枚数</th>
            <th>コスト</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in queue" :key="idx">
            <td>{{ item.type === 'straight' ? 'ストレート' : item.type === 'box' ? 'ボックス' : 'セット' }}</td>
            <td>{{ idx + 1 }}</td>
            <td>{{ item.guess.join('') }}</td>
            <td>{{ item.count }}</td>
            <td>¥{{ (item.count * 200).toLocaleString() }}</td>
            <td><button @click="removeFromQueue(idx)">✕</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ③ 抽選実行 -->
    <button
      type="button"
      class="draw-button"
      :disabled="!queue.length"
      @click="executeDraw"
    >
      抽選実行
    </button>

    <!-- ④ 結果表示 -->
    <div v-if="drawn.length" class="result">
      <h4>当せん番号：{{ drawn.join('') }}</h4>
      <table>
        <thead>
          <tr>
            <th>買い方</th>
            <th>予想</th>
            <th>枚数</th>
            <th>A（完全一致）</th>
            <th>B（数字のみ一致）</th>
            <th>当せん合計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in results" :key="i">
            <td>{{ r.type === 'straight' ? 'ストレート' : r.type === 'box' ? 'ボックス' : 'セット' }}</td>
            <td>{{ r.guess.join('') }}</td>
            <td>{{ r.count }}</td>
            <td>{{ r.matchExact }}</td>
            <td>{{ r.matchValueOnly }}</td>
            <td>¥{{ r.totalPrize.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
      <p class="summary">
        投入合計：¥{{ totalCost.toLocaleString() }}　 当せん合計：¥{{ totalPrize.toLocaleString() }}　収支：¥{{ (totalPrize - totalCost).toLocaleString() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// --- 型定義 ---
type PurchaseType = 'straight' | 'box' | 'set'
interface QueueEntry { guess: number[]; count: number; type: PurchaseType }
interface Numbers4GameResult extends QueueEntry { matchExact: number; matchValueOnly: number; singlePrize: number; totalPrize: number }

// --- component state ---
const purchaseType = ref<PurchaseType>('straight')
const guessInput   = ref('')
const ticketCount  = ref(1)
const queue        = ref<QueueEntry[]>([])
const drawn        = ref<number[]>([])
const results      = ref<Numbers4GameResult[]>([])

// --- 自動選択（4桁ランダム） ---
function autoPick4() {
  const pick: number[] = []
  while (pick.length < 4) {
    const d = Math.floor(Math.random() * 10)
    pick.push(d)
  }
  guessInput.value = pick.join('')
}

// --- 入力検証 ---
const isGuessValid = computed(() => /^\d{4}$/.test(guessInput.value))
function onGuessInput() {
  guessInput.value = guessInput.value.replace(/\D/g, '').slice(0, 4)
}

// --- キュー操作 ---
function addToQueue() {
  if (!isGuessValid.value || ticketCount.value < 1) return
  const digits = guessInput.value.split('').map(d => +d)
  queue.value.push({ guess: digits, count: ticketCount.value, type: purchaseType.value })
  guessInput.value = ''
  ticketCount.value = 1
}
function removeFromQueue(idx: number) {
  queue.value.splice(idx, 1)
}

// --- 抽選ロジック ---
function generateDraw(): number[] {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10))
}
function calcMatches(guess: number[], draw: number[]): { matchExact: number; matchValueOnly: number } {
  let exact = 0
  const restGuess: number[] = []
  const restDraw: number[]  = []
  guess.forEach((g, i) => {
    if (g === draw[i]) exact++
    else { restGuess.push(g); restDraw.push(draw[i]) }
  })
  let valueOnly = 0
  restGuess.forEach(g => {
    const i = restDraw.indexOf(g)
    if (i !== -1) { valueOnly++; restDraw.splice(i, 1) }
  })
  return { matchExact: exact, matchValueOnly: valueOnly }
}
function calcPrize(a: number, b: number, type: PurchaseType): number {
  if (type === 'straight') {
    return a === 4 ? 1000000 : 0
  }
  if (type === 'box') {
    return b === 4 ? 37500 : 0
  }
  // set
  if (type === 'set') {
    if (a === 4) return 1000000 * 0.5
    if (b === 4) return 37500 * 0.5
  }
  return 0
}

function executeDraw() {
  drawn.value = generateDraw()
  results.value = queue.value.map(item => {
    const { matchExact, matchValueOnly } = calcMatches(item.guess, drawn.value)
    const sp = calcPrize(matchExact, matchValueOnly, item.type)
    return { ...item, matchExact, matchValueOnly, singlePrize: sp, totalPrize: sp * item.count }
  })
}

// --- 集計 ---
const totalCost = computed(() => queue.value.reduce((sum, x) => sum + x.count * 200, 0))
const totalPrize= computed(() => results.value.reduce((sum, r) => sum + r.totalPrize, 0))
</script>

<style scoped>
.entry-form { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.entry-form .auto-button { background: #5cdbd3; border: none; padding: 4px 8px; cursor: pointer; color: #fff; }
.entry-form label { display: flex; align-items: center; gap: 4px; }
.entry-form input[type="text"] { width: 4.5em; text-align: center; padding: 2px 4px; }
.queue-table, .result table { width: 100%; border-collapse: collapse; margin-top: 12px; }
.queue-table th, .queue-table td, .result th, .result td { border: 1px solid #ccc; padding: 4px 8px; text-align: center; }
.draw-button { display:block; margin-top: 12px; padding: 6px 16px; }
/* 当選結果背景 */
.result {
  background: #f7f7f7;
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
  /* 内容幅に合わせる */
  display: inline-block;
  width: auto;
}
.summary { margin-top: 8px; font-weight: bold; }
/* --- 追加するスタイル --- */
.result table {
  table-layout: fixed;   /* 固定レイアウト */
  width: auto;           /* 必要に応じてテーブル全体幅を自動調整 */
}

/* 1列目：買い方（5文字程度） */
.result th:nth-child(1),
.result td:nth-child(1) {
  width: 5ch;
}

/* 2列目：予想（4〜5桁） */
.result th:nth-child(2),
.result td:nth-child(2) {
  width: 6ch;
}

/* 3列目：枚数（3桁） */
.result th:nth-child(3),
.result td:nth-child(3) {
  width: 3ch;
}

/* 4列目：A（完全一致、2桁） */
.result th:nth-child(4),
.result td:nth-child(4) {
  width: 2ch;
}

/* 5列目：B（数字のみ一致、2桁） */
.result th:nth-child(5),
.result td:nth-child(5) {
  width: 2ch;
}

/* 6列目：当選合計（最大10桁） */
.result th:nth-child(6),
.result td:nth-child(6) {
  width: 10ch;
}

/* overflow を隠して見切れる場合は省略記号を表示 */
.result th,
.result td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
