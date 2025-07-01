<!-- src/App.vue -->
<template>
  <n-layout has-sider>
    <n-layout-sider bordered :width="200" :collapsed-width="64">
      <n-menu
        :options="menuOptions"
        :value="activeKey"
        @update:value="onMenuSelect"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header
        style="background: #fff; display: flex; align-items: center"
      >
        <h2 style="margin: 0; font-size: 18px">Lucky Lotto Tracker</h2>
      </n-layout-header>
      <n-layout-content style="padding: 24px">
        <router-view/>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { MenuOption } from 'naive-ui'

const router = useRouter()
const route  = useRoute()

const menuOptions: MenuOption[] = [
  { label: '記録',      key: '/entry'   },
  { label: '一覧',      key: '/list'    },
  { label: '統計',      key: '/stats'   },
  { label: 'ナンバーズ4', key: '/numbers4' },
  { label: 'ロト6',     key: '/lotto6'  },
]

// ① 初期値は現在のパス
const activeKey = ref(route.path)

// ② ルートが変わったらメニューも連動
watch(() => route.path, p => {
  if (p !== activeKey.value) activeKey.value = p
})

// ③ メニュー選択時の遷移ハンドラ
function onMenuSelect(key: string | string[]) {
  // NaiveUI の menu は string[] で返す場合があるので
  const path = Array.isArray(key) ? key[0] : key
  if (path !== activeKey.value) {
    router.push(path)
    activeKey.value = path
  }
}
</script>

<style>
/* 必要に応じてスタイルを調整 */
body {
  margin: 0;
}
#app {
  height: 100vh;
}
</style>
