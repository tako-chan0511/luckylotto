// src/composables/useCharts.ts
import type { LottoRecord } from '@/types';
import { computed } from 'vue';

export function useCharts(records: LottoRecord[]) {
  const seriesData = computed(() => 
    records.map(r => ({ 
      name: r.date, 
      value: [r.date, r.prize - r.cost] 
    }))
  );
  return { seriesData };
}
