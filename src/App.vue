<!-- src/App.vue -->
<template>
  <n-layout has-sider>
    <!-- サイドバーメニュー -->
    <n-layout-sider bordered width="200px">
      <n-layout-sider bordered :width="200" :collapsed-width="64" />
    </n-layout-sider>

    <!-- メインコンテンツ -->
    <n-layout>
      <n-layout-header
        style="background: #fff; display: flex; align-items: center"
      >
        <h2 style="margin: 0; font-size: 18px">Lucky Lotto Tracker</h2>
      </n-layout-header>
      <n-layout-content style="padding: 24px">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { MenuOption } from "naive-ui";

// ルーターと現在のパスを取得
const router = useRouter();
const route = useRoute();

// メニューオプション定義
const menuOptions: MenuOption[] = [
  { label: "記録", key: "/entry" },
  { label: "一覧", key: "/list" },
  { label: "統計", key: "/stats" },
];

// アクティブなメニューキーを現在のパスで初期化
const activeKey = ref(route.path);

// メニュー選択時にページ遷移
function onMenuSelect(key: string) {
  if (key !== activeKey.value) {
    router.push(key);
    activeKey.value = key;
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
