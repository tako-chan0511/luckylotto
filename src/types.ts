// src/types.ts
export interface LottoRecord {
  id: string
  date: string    // ISO文字列
  type: 'numbers4' | 'loto6'
  cost: number    // 購入額（例2000）
  prize: number   // 当選額
}

export type LottoType = 'numbers4' | 'loto6';

export interface Numbers4Record {
  // EntryViewと同様の共通部分は store の LottoRecord でOK
  guess: [number, number, number, number];  // ユーザーの予想
  draw:  [number, number, number, number];  // 当せん番号
  matchCount: number;                       // 一致桁数
  prize: number;                            // 当せん金額
}