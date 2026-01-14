// src/main.ts
import { createApp }    from 'vue'
import { createPinia }  from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App              from './App.vue'
import { router }       from './router'
import NaiveUI          from 'naive-ui'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(createPinia())
  .use(router)
  .use(NaiveUI)
  .mount('#app')
