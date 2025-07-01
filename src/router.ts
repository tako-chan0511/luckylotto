// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import EntryView   from './views/EntryView.vue'
import ListView    from './views/ListView.vue'
import StatsView   from './views/StatsView.vue'
// 追加: ナンバーズ4 と ロト6 用ビュー
import Numbers4View   from '@/views/Numbers4View.vue'
import Lotto6View     from '@/views/Lotto6View.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',       redirect: '/entry' },
    { path: '/entry',  component: EntryView },
    { path: '/list',   component: ListView },
    { path: '/stats',  component: StatsView },
    // 追加: シミュレーション画面
    { path: '/numbers4', component: Numbers4View },
    { path: '/lotto6',   component: Lotto6View },
    // キャッチオール
    { path: '/:pathMatch(.*)*', redirect: '/entry' },
  ],
})
