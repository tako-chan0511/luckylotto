// src/constants/lottoTypes.ts
export type LottoType = 'numbers4' | 'lotto6';

export const lottoTypes: { label: string; value: LottoType }[] = [
  { label: 'ナンバーズ4', value: 'numbers4' },
  { label: 'ロト6',      value: 'lotto6' },
];
