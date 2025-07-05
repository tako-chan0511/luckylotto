<template>
  <n-layout has-sider>
    <n-layout-sider bordered :width="200" :collapsed-width="64">
      <n-menu
        :options="menuOptions"
        v-model:value="activeKey"
        @update:value="onMenuSelect"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header style="background:#fff; display:flex; align-items:center">
        <h2 style="margin:0; font-size:18px">Lucky Lotto Tracker</h2>
      </n-layout-header>
      <n-layout-content style="padding:24px">
        <router-view />
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
  {
    label: '実際の記録',
    key:   'record',
    children: [
      { label: '購入記録入力', key: '/record/entry' },
      { label: '一覧',           key: '/record/list'  },
      { label: '統計',           key: '/record/stats' }
    ]
  },
  {
    label: 'シミュレーション',
    key:   'sim',
    children: [
      { label: 'ナンバーズ4',   key: '/sim/numbers4' },
      { label: 'ロト6',         key: '/sim/lotto6'   },
      { label: '一覧',           key: '/sim/list'     },
      { label: '統計',           key: '/sim/stats'    }
    ]
  }
]

const activeKey = ref<string>(route.path)
watch(() => route.path, p => activeKey.value = p)

function onMenuSelect(key: string) {
  if (key.startsWith('/')) {
    router.push(key)
  }
}
</script>

<style>
body { margin: 0 }
#app { height: 100vh }
</style>
