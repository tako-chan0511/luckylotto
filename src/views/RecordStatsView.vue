<!-- src/views/RecordStatsView.vue -->
<template>
  <v-chart :option="option" autoresize style="height: 400px" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";

// レンダラーは 'echarts/renderers' から
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
// チャート本体は 'echarts/charts' から
import { LineChart, BarChart } from "echarts/charts";
// 各種コンポーネント
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
} from "echarts/components";

// 上記モジュールを一度に登録
use([
  CanvasRenderer,
  SVGRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
]);

import type { EChartsOption } from "echarts";
import { useLottoStore } from "@/store/useLottoStore";

const store = useLottoStore();
const mode = ref<"all" | "numbers4" | "lotto6">("all");

// レコードに単発損益 profit を追加
const sessions = computed(() =>
  store.records.map((r, i) => ({
    idx: i + 1,
    ...r,
    profit: (r.prize || 0) - (r.cost || 0),
  }))
);

// 単発損益配列
const oneOff = computed(() => sessions.value.map((s) => s.profit));
const oneOff4 = computed(() =>
  sessions.value.map((s) => (s.type === "numbers4" ? s.profit : 0))
);
const oneOff6 = computed(() =>
  sessions.value.map((s) => (s.type === "lotto6" ? s.profit : 0))
);

// 累積計算ヘルパー
function toCumulative(arr: number[]): number[] {
  let sum = 0;
  return arr.map((v) => (sum += v));
}

// 累積値
const cumAll = computed(() => toCumulative(oneOff.value));
const cum4 = computed(() => toCumulative(oneOff4.value));
const cum6 = computed(() => toCumulative(oneOff6.value));

// 投資額
const invest = computed(() => sessions.value.map((s) => s.cost));
// X軸
const xData = computed(() => sessions.value.map((s) => s.idx));

// 表示制御
const showAll = computed(() => mode.value === "all");
const show4 = computed(() => mode.value === "all" || mode.value === "numbers4");
const show6 = computed(() => mode.value === "all" || mode.value === "lotto6");

const option = computed(() => ({
  title: { text: "購入記録別 投資／収支推移", left: "center" },
  tooltip: {
    trigger: "axis",
    // シグネチャを any にして型エラーを解消
    formatter: (params: any) => {
      const p = Array.isArray(params)
        ? params.find((p: any) => p.data != null)
        : params;
      return p
        ? `#${p.axisValue} ${p.seriesName}: ¥${p.data.toLocaleString()}`
        : "";
    },
  },
  legend: {
    top: 30,
    data: [
      "投資額",
      ...(showAll.value ? ["累積収支(ALL)"] : []),
      ...(show4.value ? ["累積収支(N4)"] : []),
      ...(show6.value ? ["累積収支(L6)"] : []),
    ],
  },
  toolbox: { feature: { saveAsImage: {} }, right: 20 },
  xAxis: { type: "category", name: "レコード", data: xData.value },
  yAxis: {
    type: "value",
    name: "金額 (円)",
    // データ範囲に合わせて自動で拡大縮小
    scale: true,
    // 通貨表記に整形
    axisLabel: {
      formatter: (value: number) => `¥${value.toLocaleString()}`,
    },
  },
  dataZoom: [{ type: "slider", start: 0, end: 100 }],
  series: [
    {
      name: "投資額",
      type: "bar",
      data: invest.value,
      itemStyle: { color: "#888" },
    },
    ...(showAll.value
      ? [
          {
            name: "累積収支(ALL)",
            type: "line",
            data: cumAll.value,
            smooth: true,
            lineStyle: { width: 2, type: "dashed" },
            showSymbol: false,
          },
        ]
      : []),
    ...(show4.value
      ? [
          {
            name: "累積収支(N4)",
            type: "line",
            data: cum4.value,
            smooth: true,
            lineStyle: { width: 2 },
            showSymbol: false,
          },
        ]
      : []),
    ...(show6.value
      ? [
          {
            name: "累積収支(L6)",
            type: "line",
            data: cum6.value,
            smooth: true,
            lineStyle: { width: 2 },
            showSymbol: false,
          },
        ]
      : []),
  ],
}));
</script>

<style scoped>
/* 必要に応じてスタイルを調整 */
</style>
