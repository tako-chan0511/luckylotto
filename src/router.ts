// src/router.ts
import { createRouter, createWebHashHistory } from 'vue-router'

// 実際の記録用ビュー
import RecordEntryView   from '@/views/RecordEntryView.vue'
import RecordListView    from '@/views/RecordListView.vue'
import RecordStatsView   from '@/views/RecordStatsView.vue'

// シミュレーション用ビュー
import Numbers4View      from '@/views/Numbers4View.vue'
import Lotto6View        from '@/views/Lotto6View.vue'
import SimListView       from '@/views/SimListView.vue'
import SimStatsView      from '@/views/SimStatsView.vue'

export const router = createRouter({
  // ハッシュモードに切り替え（GitHub Pages などで直接リロードしても 404 にならない）
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 実際の記録
    { path: '/',               redirect: '/record/entry' },
    { path: '/record/entry',   component: RecordEntryView },
    { path: '/record/list',    component: RecordListView },
    { path: '/record/stats',   component: RecordStatsView },

    // シミュレーション
    { path: '/sim/numbers4',   component: Numbers4View },
    { path: '/sim/lotto6',     component: Lotto6View },
    { path: '/sim/list',       component: SimListView },
    { path: '/sim/stats',      component: SimStatsView },

    // キャッチオール（存在しないパスはエントリページへリダイレクト）
    { path: '/:pathMatch(.*)*', redirect: '/record/entry' },
  ],
})
