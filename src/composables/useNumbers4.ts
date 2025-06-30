// src/composables/useNumbers4.ts
import { ref } from 'vue'

/**
 * 0–9 の数字から4桁をランダムで生成
 */
function generateDraw(): [number,number,number,number] {
  return [
    Math.floor(Math.random()*10),
    Math.floor(Math.random()*10),
    Math.floor(Math.random()*10),
    Math.floor(Math.random()*10),
  ]
}

/**
 * 予想と当せん番号を比較し、「正しい数字＋正しい位置」の数を数える
 */
function countMatches(
  guess: [number,number,number,number],
  draw:  [number,number,number,number]
): number {
  return guess.reduce((cnt, g, i) => cnt + (g === draw[i] ? 1 : 0), 0)
}

/**
 * マッチ数に応じた当せん額を返す。（例示なので実際の金額に合わせて下さい）
 */
function calcPrize(matchCount: number): number {
  switch (matchCount) {
    case 4: return 10000;  // 4桁全部当てたら1万円
    case 3: return 1000;   // 3桁なら千円
    case 2: return 100;    // 2桁なら百円
    default: return 0;
  }
}

export function useNumbers4() {
  const guess = ref<[number,number,number,number]>([0,0,0,0])
  const draw  = ref<[number,number,number,number]>([0,0,0,0])
  const matchCount = ref(0)
  const prize = ref(0)

  function play() {
    draw.value = generateDraw()
    matchCount.value = countMatches(guess.value, draw.value)
    prize.value = calcPrize(matchCount.value)
  }

  return { guess, draw, matchCount, prize, play }
}
