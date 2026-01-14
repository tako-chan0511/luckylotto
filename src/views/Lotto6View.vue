<!-- src/views/Lotto6View.vue -->
<template>
  <div class="lotto6-view">
    <h2>ロト6 シミュレーション</h2>
    <Lotto6Game />
  </div>
</template>

<script setup lang="ts">
import Lotto6Game from '@/components/Lotto6Game.vue'
</script>

<style scoped>
.lotto6-view {
  padding: 20px;
}
</style>
