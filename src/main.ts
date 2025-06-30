// src/main.ts
import { createApp }    from 'vue'
import { createPinia }  from 'pinia'
import App              from './App.vue'
import { router }       from './router'
import NaiveUI          from 'naive-ui'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(NaiveUI)
  .mount('#app')
