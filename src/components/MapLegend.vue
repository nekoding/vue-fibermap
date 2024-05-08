<template>
  <div>
    <a-collapse class="legend-panel" expandIconPosition="end">
      <a-collapse-panel key="1">
        <template #header>
          <strong>Legends</strong>
          <div>CAFEINS | Version 0.0.1</div>
        </template>
        <a-row :gutter="[16, 16]">
          <a-col v-for="mapLegend in fibermapStore.mapLegends" :key="mapLegend.id" :span="12">
            <a-image :src="mapLegend.icon" :alt="mapLegend.name" width="30px" :preview="false" />
            <span style="padding-left: 10px">{{ mapLegend.name }}</span>
          </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { useFiberMapStore } from '../stores/fibermap'
const fibermapStore = useFiberMapStore()
</script>

<style scoped>
.legend-panel {
  position: relative;
  bottom: 20px;
  right: 0px;
  background: white;
  width: 400px;
  max-width: 400px;
  z-index: 999;
}

.ant-collapse-header-text {
  font-weight: bold !important;
}
</style>
