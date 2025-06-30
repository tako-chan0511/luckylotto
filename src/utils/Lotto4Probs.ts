// src/utils/lotto4Probs.ts

/** パターンに応じた順列数を返す */
export function permutationCount(multis: number[]): number {
  // multis = [同一数字の個数…] e.g. [2,1,1]→AABC
  const n = 4
  const fact = (k: number) => Array.from({length:k},(_,i)=>i+1).reduce((a,b)=>a*b,1)
  return fact(n) / multis.map(m => fact(m)).reduce((a,b)=>a*b,1)
}

/** 各パターンの確率をまとめて返す */
export function patternProbabilities() {
  type Pattern = 'AAAA'|'AAAB'|'AABB'|'AABC'|'ABCD'
  const specs: Record<Pattern, number[]> = {
    AAAA: [4],
    AAAB: [3,1],
    AABB: [2,2],
    AABC: [2,1,1],
    ABCD: [1,1,1,1],
  }
  const total = 10_000
  const results: Record<Pattern, { perm: number, Pbox: number, count: number, Ppat: number }> = {} as any

  Object.entries(specs).forEach(([pat, multis]) => {
    const perm = permutationCount(multis)
    // ボックス当せん確率 = perm / 10000
    const Pbox = perm / total
    // 母集団にこのパターンが出る通り数
    let count: number
    switch(pat) {
      case 'AAAA': count = 10; break
      case 'AAAB': count = 10 * 9 * perm; break   // 10 桁 × 9 選 × 4 位置
      case 'AABB': count = (10*9/2) * perm; break // C(10,2) × 6
      case 'AABC': count = 10 * (9*8/2) * perm; break // 10 × C(9,2) × 12
      case 'ABCD': count = (10*9*8*7/24) * perm; break // C(10,4) × 24
      default: count = 0
    }
    results[pat as Pattern] = {
      perm,
      Pbox,
      count,
      Ppat: count / total
    }
  })
  return results
}
