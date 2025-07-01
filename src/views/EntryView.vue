<!-- src/views/EntryView.vue -->
<template>
  <div class="entry-view">
    <h3>購入記録を入力</h3>
    <LottoForm />
    
  </div>
</template>

<script setup lang="ts">
// 相対パスでコンポーネントをインポート
import LottoForm from "../components/LottoForm.vue";
import Numbers4Game from "../components/Numbers4Game.vue";
</script>

<style scoped>
.entry-view {
  padding: 16px;
}
.entry-view h3 {
  margin-bottom: 12px;
}
</style>
