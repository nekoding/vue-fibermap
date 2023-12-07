<template>
  <div class="search-bar">
    <a-input placeholder="Search administrative area">
      <template #suffix>
        <search-outlined :rotate="90" />
      </template>
    </a-input>
  </div>
</template>

<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.search-bar {
  width: 300px;
  padding: 4px;
  background: #f0f0f3;
  border-radius: 6px;
  position: relative;
  z-index: 999;
  margin-bottom: 5px;
}
</style>
