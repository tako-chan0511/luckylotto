// src/store/session.ts
import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const useSessionStore = defineStore('session', {
  state: () => ({ sessions: [] as Session[] }),
  actions: { /* addSession など */ },
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ['sessions'] }
    ]
  }
})

// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
