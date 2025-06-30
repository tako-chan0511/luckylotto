// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import EntryView  from './views/EntryView.vue'
import ListView   from './views/ListView.vue'
import StatsView  from './views/StatsView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',       redirect: '/entry' },
    { path: '/entry',  component: EntryView },
    { path: '/list',   component: ListView },
    { path: '/stats',  component: StatsView },
    { path: '/:pathMatch(.*)*', redirect: '/entry' },  // キャッチオールもあると安心
  ],
})
