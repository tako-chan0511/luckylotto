<!-- src/views/Numbers4View.vue -->
<template>
  <div class="numbers4-view">
    <h2>ナンバーズ4 シミュレーション</h2>
    <Numbers4Game />
  </div>
</template>

<script setup lang="ts">
import Numbers4Game from '@/components/Numbers4Game.vue'
</script>

<style scoped>
.numbers4-view {
  padding: 20px;
}
</style>
