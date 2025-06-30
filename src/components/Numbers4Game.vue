<template>
  <div class="numbers4-game">
    <h3>ナンバーズ4（1枚 ¥200）</h3>

    <div class="entry-form">
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
            <td>
              {{
                item.type === "straight"
                  ? "ストレート"
                  : item.type === "box"
                  ? "ボックス"
                  : "セット"
              }}
            </td>
            <td>{{ idx + 1 }}</td>
            <td>{{ item.guess.join("") }}</td>
            <td>{{ item.count }}</td>
            <td>¥{{ (item.count * 200).toLocaleString() }}</td>
            <td><button @click="removeFromQueue(idx)">✕</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <button
      type="button"
      class="draw-button"
      :disabled="!queue.length"
      @click="executeDraw"
    >
      抽選実行
    </button>

    <div v-if="drawn.length" class="result">
      <h4>当せん番号：{{ drawn.join("") }}</h4>
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
            <td>
              {{
                r.type === "straight"
                  ? "ストレート"
                  : r.type === "box"
                  ? "ボックス"
                  : "セット"
              }}
            </td>
            <td>{{ r.guess.join("") }}</td>
            <td>{{ r.count }}</td>
            <td>{{ r.matchExact }}</td>
            <td>{{ r.matchValueOnly }}</td>
            <td>¥{{ r.totalPrize.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
      <p class="summary">
        投入合計：¥{{ totalCost.toLocaleString() }}　 当せん合計：¥{{
          totalPrize.toLocaleString()
        }}　 収支：¥{{ (totalPrize - totalCost).toLocaleString() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
// 作成した型定義ファイルからインポートする (パスは実際のファイル名に合わせてください)
import type { PurchaseType, Numbers4GameResult, QueueEntry } from '@/types'; // 例: '@/types/lotto'

// --- 抽選ロジック ---
function generateDraw(): number[] {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
}

/**
 * A: 完全一致
 * B: 数字は一致するが位置が違う
 */
function calcMatches(
  guess: number[],
  draw: number[]
): { matchExact: number; matchValueOnly: number } {
  // 1) 完全一致を数える
  let exact = 0;
  const guessRest: number[] = [];
  const drawRest: number[] = [];

  guess.forEach((g, i) => {
    if (g === draw[i]) {
      exact++;
    } else {
      guessRest.push(g);
      drawRest.push(draw[i]);
    }
  });

  // 2) 残りで数字だけ一致を数える（drawRest から消費していく）
  let valueOnly = 0;
  guessRest.forEach((g) => {
    const idx = drawRest.indexOf(g);
    if (idx !== -1) {
      valueOnly++;
      drawRest.splice(idx, 1);
    }
  });

  return { matchExact: exact, matchValueOnly: valueOnly };
}

/**
 * A/B の合計一致数に応じて当せん額/枚を返す
 * （例: A4→10000, A3→2000, B4→1000, B3→500 など、お好みで設定）
 */
/** calcPrize も purchaseType に応じて切り替え */
function calcPrize(a: number, b: number, type: PurchaseType): number {
  // ストレート
  if (type === "straight") {
    return a === 4 ? 1_000_000 : 0;
  }
  // ボックス
  if (type === "box") {
    // ボックスは数字が全て一致していれば当選だが、
    // 数字の並びは問わないため、matchExact (完全一致) は無視して matchValueOnly (数字のみ一致) を見るべきです。
    // かつ、重複する数字の有無で当選金額が変わるため、より複雑なロジックが必要です。
    // ここでは単純化していますが、実際のナンバーズ4のルールに合わせて調整してください。
    return b === 4 ? 37_500 : 0;
  }
  // セット（半額期待値）
  if (type === "set") {
    // ストレート配当はストレートの50%
    if (a === 4) return 1_000_000 * 0.5;
    // ボックス配当はボックスの50%
    if (b === 4) return 37_500 * 0.5;
    return 0;
  }
  return 0;
}

// --- component state ---
const guessInput = ref(""); // "1234" のように入力
const ticketCount = ref(1);
// PurchaseType を '@/types/lotto' からインポートしたものを使用
const purchaseType = ref<PurchaseType>("straight"); // デフォルトはストレート

// now queue also carries the entry’s purchaseType
// QueueEntry インターフェースを使用
const queue = ref<QueueEntry[]>([]); 

// parse guessInput into array of digits
const isGuessValid = computed(() => /^\d{4}$/.test(guessInput.value));
function onGuessInput() {
  // 入力を数字以外除去
  guessInput.value = guessInput.value.replace(/\D/g, "").slice(0, 4);
}

function addToQueue() {
  if (!isGuessValid.value || ticketCount.value < 1) return;
  const digits = guessInput.value.split("").map((d) => +d);
  queue.value.push({
    guess: digits,
    count: ticketCount.value,
    type: purchaseType.value, // ← stamp it in
  });
  guessInput.value = "";
  ticketCount.value = 1;
}

function removeFromQueue(idx: number) {
  queue.value.splice(idx, 1);
}

// draw & compute results
const drawn = ref<number[]>([]);
// Numbers4GameResult インターフェースを使用
const results = ref<Numbers4GameResult[]>([]);

function executeDraw() {
  drawn.value = generateDraw();
  // `item` の型は `QueueEntry` です
  results.value = queue.value.map((item: QueueEntry) => { // <-- ここを修正
    const { matchExact, matchValueOnly } = calcMatches(item.guess, drawn.value);
    const sp = calcPrize(matchExact, matchValueOnly, item.type);
    return {
      type: item.type,
      guess: item.guess,
      count: item.count,
      matchExact,
      matchValueOnly,
      singlePrize: sp,
      totalPrize: sp * item.count,
    };
  });
  console.log("⏺ queue =", queue.value);
  console.log("⏺ results =", results.value);
}

// aggregates
const totalCost = computed(() =>
  // `sum` の型は `number`、`x` の型は `QueueEntry` です
  queue.value.reduce((sum: number, x: QueueEntry) => sum + x.count * 200, 0) // <-- ここを修正
);
const totalPrize = computed(() =>
  // `sum` の型は `number`、`r` の型は `Numbers4GameResult` です
  results.value.reduce((sum: number, r: Numbers4GameResult) => sum + r.totalPrize, 0) // <-- ここを修正
);
</script>

<style scoped>
.numbers4-game {
  font-family: sans-serif;
  max-width: 600px;
}
.numbers4-game h3 {
  margin-bottom: 12px;
}

/* ① 入力フォーム */
.entry-form {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.entry-form label {
  display: flex;
  align-items: center;
  gap: 4px;
}
.entry-form input[type="text"] {
  width: 4.5em;
  text-align: center;
  padding: 2px 4px;
}

/* ② テーブル */
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

/* ③ 抽選ボタン */
.draw-button {
  margin-top: 12px;
  padding: 6px 16px;
}

/* ④ 結果 */
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