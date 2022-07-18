<script setup lang="ts">

function onClickBtn() {
  console.log('zsf (window as any).electronAPI', (window as any).electronAPI);
  (window as any).electronAPI && (window as any).electronAPI.setNewWebContent()
}

</script>

<template>
  <div class="main-container">
    123
    <button @click="onClickBtn">点击</button>
  </div>
</template>

<style scoped>
.main-container {
  background: #fff;
  width: 100%;
  height: 100%;
}
</style>