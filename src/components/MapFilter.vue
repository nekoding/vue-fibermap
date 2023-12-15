<template>
  <div class="toolbar-panel">
    <toolbar-button :hasTooltip="true" tooltipText="Load data">
      <template #icon>
        <DatabaseOutlined />
      </template>
    </toolbar-button>
  </div>
</template>

<script setup lang="ts">
import { DatabaseOutlined } from '@ant-design/icons-vue'
import ToolbarButton from './shared/ToolbarButton.vue'
</script>

<style scoped>
.toolbar-panel {
  position: relative;
  z-index: 999;
  margin-bottom: 5px;
}
</style>
