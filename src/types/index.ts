// src/types/index.ts
export interface LottoRecord {
  id: string
  date: string      // ISO文字列
  type: 'numbers4' | 'lotto6'
  number: string    // 例 "8192" または "1-5-12-23-34-40"
  count: number     // 購入枚数
  cost: number      // 購入金額 (枚数×200)
  prize: number     // 当選額
  revenue: number   // 収支 (prize − cost)
  comment: string
}
