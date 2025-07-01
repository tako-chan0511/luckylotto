<template>
  <div class="lotto6-game">
    <h3>ロト6（1枚 ¥200）</h3>

    <!-- ① 数字選択グリッド -->
    <div class="number-grid">
      <button
        v-for="n in 43"
        :key="n"
        :class="{ selected: selectedNumbers.includes(n) }"
        @click="toggleNumber(n)"
        :disabled="!selectedNumbers.includes(n) && selectedNumbers.length >= 6"
      >
        {{ n }}
      </button>
    </div>

    <!-- ② お任せボタン -->
    <div class="auto-pick">
      <button type="button" @click="autoPick">お任せで選ぶ</button>
      <small>（残り {{ 6 - selectedNumbers.length }} 個 選択可能）</small>
    </div>

    <!-- ③ 枚数＆追加ボタン -->
    <div class="entry-form">
      <label class="count">
        枚数：
        <input type="number" min="1" v-model.number="ticketCount" /> 枚
      </label>
      <button
        type="button"
        @click="addToQueue"
        :disabled="selectedNumbers.length !== 6"
      >
        追加
      </button>
    </div>

    <!-- ④ キュー一覧 -->
    <div v-if="queue.length" class="queue-table">
      <h4>エントリ一覧</h4>
      <table>
        <thead>
          <tr>
            <th>#</th><th>予想</th><th>枚数</th><th>コスト</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in queue" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.numbers.join('-') }}</td>
            <td>{{ item.count }}</td>
            <td>¥{{ (item.count * 200).toLocaleString() }}</td>
            <td><button @click="removeFromQueue(idx)">✕</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ⑤ 抽選実行 -->
    <button
      type="button"
      class="draw-button"
      :disabled="!queue.length"
      @click="executeDraw"
    >
      抽選実行
    </button>

    <!-- ⑥ 結果表示 -->
    <div v-if="drawn.main.length" class="result">
      <h4>
        当せん番号：{{ drawn.main.join('-') }}
        <span class="bonus">ボーナス：{{ drawn.bonus }}</span>
      </h4>
      <table>
        <thead>
          <tr>
            <th>#</th><th>予想</th><th>枚数</th>
            <th>一致数</th><th>当せん合計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in results" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ r.numbers.join('-') }}</td>
            <td>{{ r.count }}</td>
            <td>{{ r.matchCount }}</td>
            <td>¥{{ r.totalPrize.toLocaleString() }}</td>
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

import { useSessionStore } from '@/store/useSessionStore'
import { nanoid } from 'nanoid'

// Pinia のセッションストアを取得
const sessionStore = useSessionStore()

type QueueEntry6 = { numbers: number[]; count: number }
type Lotto6Result = QueueEntry6 & { matchCount: number; singlePrize: number; totalPrize: number }
type Draw6 = { main: number[]; bonus: number }

const selectedNumbers = ref<number[]>([])
const ticketCount = ref(1)
const queue = ref<QueueEntry6[]>([])
const drawn = ref<Draw6>({ main: [], bonus: 0 })
const results = ref<Lotto6Result[]>([])

/** 数字トグル */
function toggleNumber(n: number) {
  const i = selectedNumbers.value.indexOf(n)
  if (i >= 0) selectedNumbers.value.splice(i, 1)
  else if (selectedNumbers.value.length < 6) {
    selectedNumbers.value.push(n)
    selectedNumbers.value.sort((a, b) => a - b)
  }
}

/** お任せで６つ選択 */
function autoPick() {
  const pool = Array.from({ length: 43 }, (_, i) => i + 1)
  const pick: number[] = []
  while (pick.length < 6) {
    const idx = Math.floor(Math.random() * pool.length)
    pick.push(pool.splice(idx, 1)[0])
  }
  selectedNumbers.value = pick.sort((a, b) => a - b)
}

/** キューに追加 */
function addToQueue() {
  if (selectedNumbers.value.length !== 6) return
  queue.value.push({ numbers: [...selectedNumbers.value], count: ticketCount.value })
  selectedNumbers.value = []
  ticketCount.value = 1
}

/** キューから削除 */
function removeFromQueue(idx: number) {
  queue.value.splice(idx, 1)
}

/** 抽選番号を生成（本数字6 + ボーナス1） */
function generateDraw6(): Draw6 {
  const pool = Array.from({ length: 43 }, (_, i) => i + 1)
  const main: number[] = []
  while (main.length < 6) {
    const idx = Math.floor(Math.random() * pool.length)
    main.push(pool.splice(idx, 1)[0])
  }
  main.sort((a, b) => a - b)
  const bonus = pool[Math.floor(Math.random() * pool.length)]
  return { main, bonus }
}

/** マッチ数を数える */
function calcMatchCount(guess: number[], drawMain: number[]): number {
  return guess.filter(n => drawMain.includes(n)).length
}

/** 配当金 */
function calcPrize(matchCount: number, hasBonus: boolean): number {
  if (matchCount === 6) return 200_000_000
  if (matchCount === 5 && hasBonus) return 20_000_000
  if (matchCount === 5) return 400_000
  if (matchCount === 4) return 6_800
  if (matchCount === 3) return 1_000
  return 0
}

/** 抽選実行 */
function executeDraw() {
  const draw = generateDraw6()
  drawn.value = draw
  results.value = queue.value.map(e => {
    const m = calcMatchCount(e.numbers, draw.main)
    const hasB = e.numbers.includes(draw.bonus)
    const sp = calcPrize(m, hasB)
    return { ...e, matchCount: m, singlePrize: sp, totalPrize: sp * e.count }
  })

   // --- ここで lotto6 セッションを記録 ---
  const roi = totalCost.value > 0
    ? (totalPrize.value / totalCost.value) * 100
    : 0
  sessionStore.addSession({
    id:         nanoid(),
    date:       new Date().toISOString(),
    gameType:   'lotto6',
    entries:    queue.value.map(e => ({ numbers: e.numbers, count: e.count })),
    results:    results.value.map(r => ({ matchCount: r.matchCount, prize: r.totalPrize })),
    totalCost:  totalCost.value,
    totalPrize: totalPrize.value,
    roi
  })
}

/** 集計 */
const totalCost = computed(() => queue.value.reduce((s, e) => s + e.count * 200, 0))
const totalPrize = computed(() => results.value.reduce((s, r) => s + r.totalPrize, 0))
</script>

<style scoped>
.number-grid {
  display: grid;
  grid-template-columns: repeat(7, 32px);
  grid-auto-rows: 32px;
  gap: 2px;
  margin-bottom: 12px;
}
.number-grid button {
  width: 100%; height: 100%; padding: 0;
  font-size: 14px; line-height: 32px;
  background: #f0f0f0; color: #333;
  border: 1px solid #ccc; border-radius: 4px;
  cursor: pointer; transition: background 0.2s;
}
.number-grid button:hover:not(.selected) { background: #e0e0e0 }
.number-grid button.selected { background: #36cfc9; color: #fff; border-color: #36cfc9 }
.bonus { margin-left: 16px; color: #e94e77; font-weight: bold }
.entry-form { display: flex; align-items: center; gap: 8px; margin-bottom: 20px }
.queue-table, 
/* テーブル全体を固定レイアウトに */
.result table {
  table-layout: fixed;
  width: auto; /* 必要に応じて全体幅も指定可 */
}
/* 各列の幅を確保 */
.col-index  { width:  60px;  } /* # 列 */
.col-guess  { width: 200px; } /* 予想（最大20文字程度） */
.col-count  { width:  80px;  } /* 枚数 */
.col-match  { width:  80px;  } /* 一致数 */
.col-prize  { width: 120px; } /* 当せん金（10桁まで対応） */
.queue-table th, .queue-table td, 
.result th, .result td { border: 1px solid #ccc; padding: 4px 8px; text-align: center }
.draw-button { display: block;    margin-top: 12px; padding: 6px 16px }
/* Lotto6Game.vue の <style> 内 に追加／修正 */
.result {
  display: inline-block;      /* 幅を内容にフィットさせる */
  background: #f7f7f7;        /* 既存の薄墨 */
  padding: 12px;              /* 余白はそのまま */
  border-radius: 6px;
  margin-top: 16px;
}

/* テーブルも自動幅に */
.result table {
  table-layout: auto;
  width: auto;
}
.summary { margin-top: 8px; font-weight: bold }
</style>
