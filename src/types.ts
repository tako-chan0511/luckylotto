// src/types.ts

// 既存の LottoRecord はそのまま維持します
export interface LottoRecord {
  id: string;
  date: string;    // ISO文字列 (例: "2025-06-30T10:00:00.000Z")
  type: 'numbers4' | 'lotto6'; // 抽選の種類
  cost: number;    // 購入額（例: 2000）
  prize: number;   // 当選額（このレコード全体の当選額）
}

// 既存の LottoType もそのまま維持します
export type LottoType = 'numbers4' | 'lotto6';

// Numbers4Game.vue で使用される、購入タイプを定義します
// 例えば、selectボックスの選択肢などに利用されます。
export type PurchaseType = "straight" | "box" | "set" | "mini"; // 'mini' もあれば追加してください

// ナンバーズ4ゲームで、抽選キューに追加されるエントリーの型です
// ユーザーが入力した予想番号と枚数、購入タイプを管理します。
export interface QueueEntry {
  guess: number[]; // ユーザーの予想番号（例: [1, 2, 3, 4]）
  count: number;   // 購入枚数
  type: PurchaseType; // 購入タイプ (例: "straight", "box")
}

// ナンバーズ4ゲームで、抽選後に計算される詳細な結果の型です
// これは Numbers4Game.vue の `results` 変数で使用されているものです。
// 当選パターンごとの詳細な一致数や金額が含まれます。
export interface Numbers4GameResult {
  type: PurchaseType;      // 買い方 (例: "straight", "box")
  guess: number[];         // 予想番号
  count: number;           // 購入枚数
  matchExact: number;      // 完全一致数（ストレート向け）
  matchValueOnly: number;  // 数字のみ一致数（ボックス向け）
  singlePrize: number;     // 1枚あたりの当選金額
  totalPrize: number;      // 合計当選金額 (singlePrize * count)
}

// 新しくご要望いただいた Numbers4Record の型定義です。
// LottoRecord の共通部分 (id, date, type, cost, prize) を継承し、
// ナンバーズ4固有の情報 (guess, draw, matchCount) を追加します。
// これは、特定のナンバーズ4のプレイ記録を詳細に保存・表示する際に利用できるでしょう。
export interface Numbers4Record extends LottoRecord {
  // LottoRecord から id, date, type, cost, prize を継承します

  // Numbers4固有の追加情報
  guess: number[];         // ユーザーの予想番号（例: [1, 2, 3, 4]）
  draw: number[];          // 当選番号（その回の抽選結果、例: [5, 6, 7, 8]）
  matchCount: number;      // 一致桁数（このプロパティの具体的な計算ロジックは、
                           // アプリケーション内で別途定義する必要があります。
                           // Numbers4GameResult の matchExact/matchValueOnly とは
                           // 別に、何らかの一致数を表すものと想定しています。）
}

export interface Lotto6Entry {
  guess: number[]
  count: number
}

export interface Lotto6Result extends Lotto6Entry {
  matchCount: number
  prizePerTicket: number
}
